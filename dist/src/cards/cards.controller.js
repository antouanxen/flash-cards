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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsController = void 0;
const common_1 = require("@nestjs/common");
const cards_service_1 = require("./providers/cards.service");
const create_card_dto_1 = require("./dtos/create-card.dto");
const errorCodes_1 = require("../utils/errorCodes");
const get_cards_dto_1 = require("./dtos/get-cards.dto");
const update_card_dto_1 = require("./dtos/update-card.dto");
const find_cardById_dto_1 = require("./dtos/find-cardById.dto");
const swagger_1 = require("@nestjs/swagger");
const prisma_Client_1 = require("../../prisma/prisma_Client");
const syncCardsFromSQLite_dto_1 = require("./dtos/syncCardsFromSQLite.dto");
let CardsController = class CardsController {
    constructor(cardService) {
        this.cardService = cardService;
    }
    async syncCards(syncCardsDTO, req, res) {
        const userid = req.res.locals.user;
        const { cards } = syncCardsDTO;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const syncedCards = await this.cardService.syncCardsFromSQLite(cards, userid);
        if (syncedCards.length > 0) {
            console.log(`A total number of ${syncedCards.length} cards have been made and synced with the server`);
            res.status(201).json({ syncedCards });
        }
        else if (syncedCards.length === 0) {
            console.log('No cards needed to sync');
            res.status(204).json({ message: 'There was no cards to sync with the server' });
        }
    }
    async createCard(createCardDto, req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            console.log('Φτιαχνεις μια καρτα');
            const cardToBeCreated = await this.cardService.createCard(createCardDto, userid);
            console.log('New card:', cardToBeCreated);
            console.log('η καρτα δημιουργηθηκε');
            const user = await prisma_Client_1.default.user.findUnique({ where: { userid: userid } });
            const userCards = await prisma_Client_1.default.card.findMany({ where: { userId: user.id, deleted_at: null } });
            console.log(`Και εχει αλλες ${userCards.length} ακομα`);
            return cardToBeCreated;
        }
        catch (err) {
            console.error('Error creating cards', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllCards(getCardsDto, req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        console.log('Εδω παιρνεις ολες τις καρτες του χρηστη', userid);
        const cards = await this.cardService.getAllCards(getCardsDto, userid);
        console.log('Οι καρτες φτασανε');
        console.log('Tο συνολο τους:', cards.length);
        return cards;
    }
    async getSingleCard(findCardByIdDto, req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const singleCard = await this.cardService.getSingleCard(findCardByIdDto, userid);
        console.log('Οριστε η συγκεκριμενη καρτα');
        return singleCard;
    }
    async updateCurrentCard(id, updateCardDto, req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        updateCardDto.id = id;
        console.log('Ενημερωνεις μια καρτα');
        const updatedCard = await this.cardService.updateCard(updateCardDto, userid);
        console.log('Updated Card:', updatedCard);
        console.log('Ενημερωσες μια καρτα');
        return updatedCard;
    }
    async deleteCurrentCard(id, req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        console.log('Διαγραφεις μια καρτα');
        const result = await this.cardService.deleteCard(id, userid);
        if (typeof result === 'string') {
            console.error('Error to delete that card');
            throw new common_1.HttpException({ message: 'Could not delete that card', errorCode: errorCodes_1.ErrorCodes.CARD_DELETE_ERROR }, common_1.HttpStatus.BAD_REQUEST);
        }
        console.log('Διεγραψες μια καρτα');
    }
    async deleteAllCards(req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const result = await this.cardService.deleteALLCards(userid);
        if (typeof result === 'string') {
            console.error('Error to delete that card');
            throw new common_1.HttpException({ message: 'Could not delete that card', errorCode: errorCodes_1.ErrorCodes.CARD_DELETE_ERROR }, common_1.HttpStatus.BAD_REQUEST);
        }
        console.log(`Διεγραψες ολες τις καρτες του χρηστη ${userid}`);
    }
};
exports.CardsController = CardsController;
__decorate([
    (0, common_1.Post)('sync-cards'),
    (0, swagger_1.ApiOperation)({
        summary: 'Use this endpoint to synchronize a single or a number of cards with the server based on the body, updating the data to the server'
    }),
    (0, swagger_1.ApiBody)({
        description: 'Fill the body requirements as shown below',
        schema: { type: 'array', properties: {
                cardId: { type: 'string', format: 'uuid', example: 'e1e5a6a3-d42e-4e73-9f37-f9a3a5e545io', description: 'UUID for each of the cards that get to sync with the server, generated by the SQLite db' },
                front_text: { type: 'string', example: 'A' },
                back_text: { type: 'string', example: 'B' },
                color: { type: 'string', example: '#FF0000' },
                created_at: { type: 'string/Date', example: '2024-10-08 14:11:29.802', description: 'It creates a timestamp for the card created, can be optional' },
                updated_at: { type: 'string/Date', example: '2024-10-08 14:11:29.802', description: 'It creates a timestamp for the card from the most recent update, can be optional' },
                deleted_at: { type: 'string/Date', example: '2024-10-08 14:11:29.802', description: 'It creates a timestamp for the card that got soft deleted but still exists in the database, can be null also' },
                collectionId: { type: 'string', format: 'uuid', example: 'e1e5a6a3-d42e-4e73-9f37-f9a3a5e678e0', description: 'Optional UUID for the collection/ Create a collection first to implement, can be null also' },
                image_name: { type: 'string', example: 'image-b0d0cb5c-e0dd-4192-9d13-1c3f0da69749.jpg', description: 'Optional name for the image/ Create an image first to implement, can be null also' }
            }, required: ['cardId', 'front_text', 'back_text', 'color']
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'A card is (or a number of them are) synced successfully with the server by being updated or created anew' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'A card is (or a number of them are) synced successfully with the server but have no changes at all' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request. Could not make that card' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [syncCardsFromSQLite_dto_1.SyncCardsDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "syncCards", null);
__decorate([
    (0, common_1.Post)('create-card'),
    (0, swagger_1.ApiOperation)({
        summary: 'Use this endpoint to create a card based on the body'
    }),
    (0, swagger_1.ApiBody)({
        description: 'Fill the body requirements as shown below',
        schema: { type: 'object', properties: {
                front_text: { type: 'string', example: 'A' },
                back_text: { type: 'string', example: 'B' },
                color: { type: 'string', example: '#FF0000' },
                collectionId: { type: 'string', format: 'uuid', example: 'e1e5a6a3-d42e-4e73-9f37-f9a3a5e678e0', description: 'Optional UUID for the collection/ Create a collection first to implement, can be null also' },
                image_name: { type: 'string', example: 'image-b0d0cb5c-e0dd-4192-9d13-1c3f0da69749.jpg' }
            }, required: ['front_text', 'back_text', 'color']
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'A card is created successfully and gets stored in the database' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request. Could not make that card' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_card_dto_1.CreateCardDto, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "createCard", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to fetch all the cards of the current user based on the token provided by Firebase' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All cards of the user fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Any card was not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_cards_dto_1.GetCardsDto, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "getAllCards", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to fetch a single card of the current user based on the token provided by Firebase' }),
    (0, swagger_1.ApiParam)({ name: 'id', schema: { type: 'string', format: 'uuid', example: 'fbb6d83a-ab25-4fcc-8bd9-38f6a00399f0', description: 'Unique identifier for the resource' }, required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card of the user fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'That card was not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_cardById_dto_1.FindCardByIdDTO, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "getSingleCard", null);
__decorate([
    (0, common_1.Patch)(':id/update-card'),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to update a single card of the current user based on the token provided by Firebase' }),
    (0, swagger_1.ApiBody)({
        description: 'Fill the body requirements as shown below',
        schema: { type: 'object', properties: {
                front_text: { type: 'string', example: 'C' },
                back_text: { type: 'string', example: 'D' },
                color: { type: 'string', example: '#FF0000' },
                collectionId: { type: 'string', format: 'uuid', example: 'e1e5a6a3-d42e-4e73-9f37-f9a3a5e678e0', description: 'Optional UUID for the collection/ Create a collection first to implement, can be null also' }
            }, required: ['front_text', 'back_text', 'color']
        },
    }),
    (0, swagger_1.ApiParam)({ name: 'id', schema: { type: 'string', format: 'uuid', example: 'fbb6d83a-ab25-4fcc-8bd9-38f6a00399f0', description: 'Unique identifier for the resource' }, required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card of the user updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'That card was not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_card_dto_1.UpdateCardDto, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "updateCurrentCard", null);
__decorate([
    (0, common_1.Delete)(':id/delete-card'),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to delete a single card of the current user based on the token provided by Firebase' }),
    (0, swagger_1.ApiParam)({ name: 'id', schema: { type: 'string', format: 'uuid', example: 'fbb6d83a-ab25-4fcc-8bd9-38f6a00399f0', description: 'Unique identifier for the resource' }, required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'A Card of the user deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'That card was not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "deleteCurrentCard", null);
__decorate([
    (0, common_1.Delete)('/total-delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to delete all **CARDS**!!! of the current user based on the token provided by Firebase' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All Cards of the user deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "deleteAllCards", null);
exports.CardsController = CardsController = __decorate([
    (0, common_1.Controller)('cards'),
    (0, swagger_1.ApiTags)('Cards'),
    __metadata("design:paramtypes", [cards_service_1.CardsService])
], CardsController);
//# sourceMappingURL=cards.controller.js.map