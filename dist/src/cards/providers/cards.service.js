"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const collections_service_1 = require("../../collections/providers/collections.service");
const errorCodes_1 = require("../../utils/errorCodes");
const prisma_Client_1 = require("../../../prisma/prisma_Client");
const Card_Back_Text_Truncated_1 = require("../../utils/Card_Back_Text_Truncated");
const findCardColAndOverride_1 = require("../../utils/findCardColAndOverride");
const synCardsForService_1 = require("./synCardsForService");
const CardChangesInBody_1 = require("../../utils/CardChangesInBody");
const image_service_1 = require("../../image/providers/image.service");
const gettingCardIdForImage_1 = require("../../utils/gettingCardIdForImage");
let CardsService = class CardsService {
    constructor(collectionService, synCardsForService, imageService) {
        this.collectionService = collectionService;
        this.synCardsForService = synCardsForService;
        this.imageService = imageService;
        this.backTextShort = new Card_Back_Text_Truncated_1.Back_Text_Truncated();
    }
    async syncCardsFromSQLite(cards, userid) {
        let updatedCards = [];
        try {
            console.log(`A number of ${cards.length} cards are ready to sync with the server`);
            for (const card of cards) {
                const existingCard = await prisma_Client_1.default.card.findUnique({ where: { id: card.id } });
                let image;
                if (!existingCard) {
                    console.log(`Card with ID ${card.id} does not exist. It will be added.`);
                    updatedCards.push(card);
                    continue;
                }
                const cardDeletedAt = card.deleted_at ? new Date(card.deleted_at).getTime() : null;
                const existingCardDeletedAt = existingCard.deleted_at ? new Date(existingCard.deleted_at).getTime() : null;
                const cardTruncated = this.backTextShort.cardForLogging(card, 50);
                const cardChanges = cardTruncated.front_text !== existingCard.front_text ||
                    cardTruncated.back_text !== existingCard.back_text ||
                    cardTruncated.color !== existingCard.color ||
                    cardDeletedAt !== existingCardDeletedAt ||
                    cardTruncated.collectionId !== existingCard.collectionId ||
                    cardTruncated.image_name !== existingCard.image_name;
                if (cardChanges) {
                    console.log(`-Card ${card.id} has changed.`);
                    await (0, CardChangesInBody_1.cardChangesInBody)(cardChanges, card);
                    if (cardTruncated.image_name && cardTruncated.image_name !== existingCard.image_name) {
                        const previousImage = await this.imageService.getImageByName(existingCard.image_name);
                        if (previousImage && previousImage === image) {
                            await this.imageService.getAloneImgAndDelete(previousImage);
                        }
                        await (0, gettingCardIdForImage_1.gettingCardIdForImage)(cardTruncated.image_name, cardTruncated.id);
                    }
                    updatedCards.push(cardTruncated);
                }
            }
            if (updatedCards.length > 0) {
                console.log('Καρτες που χρειαστηκαν Syncing:', updatedCards.length);
                return await this.synCardsForService.syncCardsFromSQLite({ cards: updatedCards }, userid);
            }
            else {
                console.log('No cards have changed, nothing to sync.');
                return [];
            }
        }
        catch (err) {
            console.log('Λαθος με το sync των καρτων', err);
            throw new common_1.HttpException({ message: 'Could not sync with the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCard(createCardDto, userid) {
        const user = await prisma_Client_1.default.user.findUnique({
            where: { userid: userid },
            include: {
                cards: { include: { collection: true } },
                collections: true
            }
        });
        if (!user) {
            throw new common_1.HttpException({ message: 'This user was not found', errorCode: errorCodes_1.ErrorCodes.USER_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
        }
        try {
            const { front_text, back_text, color, collectionId, image_name } = createCardDto;
            let collectionIdToUse;
            let imageNameToUse;
            console.log('collectionid', collectionId);
            if (collectionId) {
                const cardCollection = await this.collectionService.getSingleCollection(createCardDto.collectionId, userid);
                if (cardCollection && cardCollection.userId === user.id) {
                    collectionIdToUse = cardCollection.id;
                }
                else
                    throw new common_1.HttpException({ message: 'That collection was not found', errorCode: errorCodes_1.ErrorCodes.COLLECTION_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
            }
            if (image_name) {
                const image = await this.imageService.getImageByName(createCardDto.image_name);
                if (typeof image === 'object' && image !== null) {
                    imageNameToUse = image.image_name;
                }
                else
                    imageNameToUse = null;
            }
            await prisma_Client_1.default.$executeRaw `INSERT INTO card (
                front_text,
                back_text,
                color,
                "userId",
                "collectionId",
                image_name
            ) VALUES (
                ${front_text},
                ${back_text},
                ${color},
                ${user.id}::UUID,
                ${collectionIdToUse ? collectionIdToUse : null}::UUID,
                ${imageNameToUse ? imageNameToUse : null} 
            )
        `;
            console.log('πηρε τη καρτα');
            const newCard = await prisma_Client_1.default.$queryRaw `
                SELECT c.id, c.front_text, c.back_text, c.color, c.created_at, c.updated_at, c.deleted_at, c."userId", c."collectionId", c.image_name
                FROM card c
                LEFT JOIN collection col ON c."collectionId" = col.id
                LEFT JOIN image i ON c.image_name = i.image_name
                WHERE c.front_text = ${front_text}
                AND c.back_text = ${back_text}
                AND c.color = ${color}
                AND c."userId" = ${user.id}::UUID
                AND (c."collectionId" = ${collectionIdToUse}::UUID OR c."collectionId" IS NULL)
                AND (c.image_name = ${imageNameToUse} OR c.image_name IS NULL)
                ORDER BY c.created_at DESC
                LIMIT 1
            `;
            console.log('newCard');
            if (!newCard || newCard.length === 0) {
                throw new Error('Η νέα κάρτα δεν βρέθηκε μετά την εισαγωγή.');
            }
            const card = newCard[0];
            if (card.collectionId)
                await (0, findCardColAndOverride_1.findCardColAndOverride)(card);
            if (card.image_name)
                await (0, gettingCardIdForImage_1.gettingCardIdForImage)(card.image_name, card.id);
            const cardForLogging = {
                id: card.id,
                front_text: card.front_text,
                back_text: card.back_text,
                color: card.color,
                created_at: card.created_at,
                updated_at: card.updated_at,
                deleted_at: card.deleted_at || null,
                userId: user.id,
                collectionId: card.collectionId || null,
                collection: card.collectionId ? {
                    id: card.collectionId,
                    name: card.collection?.name
                } : null,
                image_name: card.image_name || null
            };
            const cardTruncated = this.backTextShort.cardForLogging(cardForLogging);
            console.log('η καρτα ειναι ετοιμη για save');
            return cardTruncated;
        }
        catch (err) {
            console.log('η καρτα δεν δημιουργηθηκε', err);
            throw new common_1.HttpException({ message: 'Could not create that card', errorCode: errorCodes_1.ErrorCodes.CARD_CREATE_ERROR }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllCards(getCardsDto, userid) {
        try {
            const cards = await prisma_Client_1.default.card.findMany({
                where: { user: { userid: userid }, deleted_at: null },
                include: { collection: true }
            });
            const user = await prisma_Client_1.default.user.findUnique({
                where: { userid: userid }
            });
            if (cards.length > 0) {
                console.log('Cards:');
                const maxCardsToSHOW = 15;
                cards.slice(0, maxCardsToSHOW).forEach((card) => {
                    const cardTruncated = this.backTextShort.cardForLogging(card, 50);
                    console.log(cardTruncated);
                });
                if (cards.length > maxCardsToSHOW) {
                    console.log('και πολλές κάρτες ακόμα...');
                }
                console.log(`Απο τον χρηστη: ${user.userid} με ονομα ${user.username}`);
                return cards;
            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log('oι καρτες δεν ηρθανε', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSingleCard(findCardByIdDto, userid) {
        const { id } = findCardByIdDto;
        const cardToFind = await prisma_Client_1.default.card.findUnique({
            where: { id: id },
            include: { user: true }
        });
        if (!cardToFind) {
            throw new common_1.HttpException({ message: 'That card was not found', errorCode: errorCodes_1.ErrorCodes.CARD_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
        }
        const cardTruncated = this.backTextShort.cardForLogging(cardToFind);
        return cardTruncated;
    }
    async updateCard(updateCardDto, userid) {
        try {
            const { id, front_text, back_text, color, collectionId, image_name } = updateCardDto;
            const cardToBeUpdated = await prisma_Client_1.default.card.findUnique({
                where: { id: id },
                include: { user: true, collection: true }
            });
            if (!cardToBeUpdated) {
                throw new common_1.HttpException({ message: 'Card was not found', errorCode: errorCodes_1.ErrorCodes.CARD_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
            }
            if (cardToBeUpdated.user.userid !== userid) {
                throw new common_1.HttpException({ message: 'User is not authorized to proceed', errorCode: errorCodes_1.ErrorCodes.AUTH_FAILURE }, common_1.HttpStatus.UNAUTHORIZED);
            }
            console.log(`Card "${cardToBeUpdated.front_text}" with ID: ${id} created by user "${cardToBeUpdated.user.username}" is being updated.`);
            const updatedCard = await prisma_Client_1.default.card.update({
                where: { id: id },
                data: {
                    front_text: front_text,
                    back_text: back_text,
                    color: color,
                    collectionId: collectionId,
                    image_name: image_name
                }
            });
            console.log('η καρτα ενημερωθηκε');
            const cardTruncated = await this.backTextShort.cardForLogging(updatedCard);
            return cardTruncated;
        }
        catch (err) {
            console.log('η καρτα δεν ενημερωθηκε', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCard(id, userid) {
        try {
            const cardToBeDeleted = await prisma_Client_1.default.card.findUnique({
                where: { id: id },
                include: { user: true, collection: true }
            });
            if (!cardToBeDeleted) {
                throw new common_1.HttpException({ message: 'Card was not found', errorCode: errorCodes_1.ErrorCodes.CARD_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
            }
            if (cardToBeDeleted.user.userid !== userid) {
                throw new common_1.HttpException({ message: 'User is not authorized to proceed', errorCode: errorCodes_1.ErrorCodes.AUTH_FAILURE }, common_1.HttpStatus.UNAUTHORIZED);
            }
            console.log(`Card "${cardToBeDeleted.front_text}" with ID: ${id} created by user "${cardToBeDeleted.user.username}" is being deleted.`);
            await prisma_Client_1.default.card.update({
                where: { id: id },
                data: { deleted_at: new Date() }
            });
            console.log('Card deleted by', userid);
            const userWithUpdatedCards = await prisma_Client_1.default.user.findUnique({ where: { userid: userid }, include: { cards: { where: { deleted_at: null } } } });
            const restOfCards = userWithUpdatedCards?.cards || [];
            console.log(`Αλλες καρτες απο τον χρηστη ${userWithUpdatedCards?.username}:`);
            if (restOfCards && restOfCards.length > 0) {
                restOfCards.forEach((card) => {
                    console.log(`- ${card.front_text} with (ID: ${card.id})`);
                });
            }
            else
                console.log(`${userWithUpdatedCards?.username} does not have any more cards`);
            return;
        }
        catch (err) {
            console.log('Card did not get deleted', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteALLCards(userid) {
        const user = await prisma_Client_1.default.user.findUnique({
            where: { userid: userid },
            include: { cards: true }
        });
        if (!user) {
            throw new common_1.HttpException({ message: 'User not found', errorCode: 'USER_NOT_FOUND' }, common_1.HttpStatus.NOT_FOUND);
        }
        if (user.cards.length > 0) {
            await prisma_Client_1.default.card.deleteMany({
                where: { userId: user.id }
            });
        }
        return;
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [collections_service_1.CollectionService,
        synCardsForService_1.SynCardsForService,
        image_service_1.ImageService])
], CardsService);
//# sourceMappingURL=cards.service.js.map