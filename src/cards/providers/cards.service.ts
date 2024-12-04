import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CollectionService } from 'src/collections/providers/collections.service';
import { CreateCardDto } from '../dtos/create-card.dto';
import { card, image } from '@prisma/client';
import { ErrorCodes } from 'src/utils/errorCodes';
import prisma from 'prisma/prisma_Client';
import { GetCardsDto } from '../dtos/get-cards.dto';
import { UpdateCardDto } from '../dtos/update-card.dto';
import { Back_Text_Truncated } from 'src/utils/Card_Back_Text_Truncated';
import { findCardColAndOverride } from 'src/utils/findCardColAndOverride';
import { SynCardsForService } from './synCardsForService';
import { Card } from '../card.interface';
import { cardChangesInBody } from 'src/utils/CardChangesInBody';
import { ImageService } from 'src/image/providers/image.service';
import { gettingCardIdForImage } from 'src/utils/gettingCardIdForImage';
import { turnToNull } from 'src/utils/turnDeleteAtToNull.function';

@Injectable()
export class CardsService {
    constructor(
        private readonly collectionService: CollectionService,
        private readonly synCardsForService: SynCardsForService,
        private readonly imageService: ImageService
    ) {}

    backTextShort = new Back_Text_Truncated()

    public async syncCardsFromSQLite(cards: card[], userid: string): Promise<card[]> {
        let updatedCards: Card[] = []
        
        try {    
            console.log(`A number of ${cards.length} cards are ready to sync with the server`)

            for (const card of cards) {
                const existingCard = await prisma.card.findUnique({ where: { id: card.id } })
                let image: image

                if (!existingCard) {
                    console.log(`Card with ID ${card.id} does not exist. It will be added.`);
                    updatedCards.push(card);
                    continue; 
                }
                const cardDeletedAt = turnToNull(card.deleted_at)   //card.deleted_at ? new Date(card.deleted_at).getTime() : null;
                const existingCardDeletedAt = turnToNull(existingCard.deleted_at) //existingCard.deleted_at ? new Date(existingCard.deleted_at).getTime() : null;
                
                const cardTruncated = this.backTextShort.cardForLogging(card, 50);

                const cardChanges =
                    cardTruncated.front_text !== existingCard.front_text ||
                    cardTruncated.back_text !== existingCard.back_text ||
                    cardTruncated.color !== existingCard.color ||
                    cardDeletedAt !== existingCardDeletedAt ||
                    cardTruncated.collectionId !== existingCard.collectionId ||
                    cardTruncated.image_name !== existingCard.image_name
                
                if (cardChanges) {
                    console.log(`-Card ${card.id} has changed.`);
                    await cardChangesInBody(cardChanges, card)
                    if (cardTruncated.image_name && cardTruncated.image_name !== existingCard.image_name) {
                        const previousImage = await this.imageService.getImageByName(existingCard.image_name)
                        if (previousImage && previousImage === image) {
                            await this.imageService.getAloneImgAndDelete(previousImage)
                        } 
                        await gettingCardIdForImage(cardTruncated.image_name, cardTruncated.id)
                    }  

                    updatedCards.push(cardTruncated);
                }
            }

            if (updatedCards.length > 0) {
                console.log('Καρτες που χρειαστηκαν Syncing:', updatedCards.length);
                return await this.synCardsForService.syncCardsFromSQLite({ cards: updatedCards }, userid)
            } else {
                console.log('No cards have changed, nothing to sync.');
                return []
            }
        } catch(err: any) {
            console.log('Λαθος με το sync των καρτων', err)
            throw new HttpException({ message: 'Could not sync with the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async createCard(createCardDto: CreateCardDto, userid: string): Promise<card> {
        const user = await prisma.user.findUnique({ 
            where: { userid: userid },
            include: { 
                cards: { include: { collection: true } },
                collections: true }
        })

        if (!user) {
            throw new HttpException({ message: 'This user was not found', errorCode: ErrorCodes.USER_NOT_FOUND }, HttpStatus.NOT_FOUND)
        }

        try {
            const { front_text, back_text, color, collectionId, image_name } = createCardDto
            let collectionIdToUse: string | null 
            let imageNameToUse: string | null

            console.log('collectionid',collectionId);        
            
            if (collectionId) {
                const cardCollection = await this.collectionService.getSingleCollection(createCardDto.collectionId, userid)

                if (cardCollection && cardCollection.userId === user.id) {
                    collectionIdToUse = cardCollection.id
                }
                else throw new HttpException({ message: 'That collection was not found', errorCode: ErrorCodes.COLLECTION_NOT_FOUND }, HttpStatus.NOT_FOUND)
            }

            /* const newCard = await prisma.card.create({
                data: { 
                    front_text: front_text,
                    back_text: back_text, 
                    color: color, 
                    userId: user.id, 
                    collectionId: collectionIdToUse
                }
            }) */
            if (image_name) {
                const image = await this.imageService.getImageByName(createCardDto.image_name)

                if (typeof image === 'object' && image !== null) {
                    imageNameToUse = image.image_name;
                } 
                else imageNameToUse = null; 
            }

            await prisma.$executeRaw`INSERT INTO card (
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
        `
            console.log('πηρε τη καρτα');
               
            const newCard = await prisma.$queryRaw<{ 
                id: string;
                front_text: string;
                back_text: string;
                color: string;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null
                userId: string;
                collectionId?: string | null
                collection: {
                    id: string
                    name: string
                } | null
                image_name?: string | null
            }[]>`
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
            `
            console.log('newCard');
            if (!newCard || newCard.length === 0) {
                throw new Error('Η νέα κάρτα δεν βρέθηκε μετά την εισαγωγή.');
            }

            const card = newCard[0]

            if (card.collectionId) await findCardColAndOverride(card)
            
            if (card.image_name) await gettingCardIdForImage(card.image_name, card.id)

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

            return cardTruncated
        } catch (err: any){
            console.log('η καρτα δεν δημιουργηθηκε', err);
            throw new HttpException({ message: 'Could not create that card', errorCode: ErrorCodes.CARD_CREATE_ERROR }, HttpStatus.BAD_REQUEST)
        }
    }

    public async getAllCards(getCardsDto: GetCardsDto, userid: string) {
        try {
            const cards = await prisma.card.findMany({
                where: { user: { userid: userid }, deleted_at: null },
                include: { collection: true } 
            })

            const user = await prisma.user.findUnique({ 
                where: { userid: userid }
            })

            if (cards.length > 0) {
                console.log('Cards:')
                const maxCardsToSHOW = 15
               
                cards.slice(0, maxCardsToSHOW).forEach((card) => {
                    const cardTruncated = this.backTextShort.cardForLogging(card, 50)
                    console.log(cardTruncated)
                }) 
               
                if (cards.length > maxCardsToSHOW) {
                    console.log('και πολλές κάρτες ακόμα...');
                }
                
                console.log(`Απο τον χρηστη: ${user.userid} με ονομα ${user.username}`);
                
                return cards
            } else {
                return []
            }
        } catch (err: any) {
            console.log('oι καρτες δεν ηρθανε', err);
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async getSingleCard(cardId: string, userid: string) {
  
        const cardToFind = await prisma.card.findUnique({
            where: { id: cardId },
            include: { user: true }
        })

        if (!cardToFind) {
            throw new HttpException({message: 'That card was not found', errorCode: ErrorCodes.CARD_NOT_FOUND }, HttpStatus.NOT_FOUND)
        }

        const cardTruncated = this.backTextShort.cardForLogging(cardToFind)
        return cardTruncated
    }

    public async updateCard(updateCardDto: UpdateCardDto, userid: string): Promise<UpdateCardDto> {
        try {
            const { id , front_text, back_text, color, collectionId, image_name } = updateCardDto
            const cardToBeUpdated = await prisma.card.findUnique({
                where: { id: id },
                include: { user: true, collection: true }
            })

            if (!cardToBeUpdated) {
                throw new HttpException({ message: 'Card was not found', errorCode: ErrorCodes.CARD_NOT_FOUND }, HttpStatus.NOT_FOUND)
            }

            if (cardToBeUpdated.user.userid !== userid) {
                throw new HttpException({ message: 'User is not authorized to proceed', errorCode: ErrorCodes.AUTH_FAILURE }, HttpStatus.UNAUTHORIZED)
            }

            console.log(`Card "${cardToBeUpdated.front_text}" with ID: ${id} created by user "${cardToBeUpdated.user.username}" is being updated.`); 

            const updatedCard = await prisma.card.update({
                where: { id: id },
                data: { 
                    front_text: front_text,
                    back_text: back_text,
                    color: color,
                    collectionId: collectionId,
                    image_name: image_name
                }
            })
            console.log('η καρτα ενημερωθηκε');
            
            const cardTruncated = await this.backTextShort.cardForLogging(updatedCard)
            return cardTruncated
        } catch (err: any){
            console.log('η καρτα δεν ενημερωθηκε', err);
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async deleteCard(id: string, userid: string) {
        try {
           
            const cardToBeDeleted = await prisma.card.findUnique({
                where: { id: id },
                include: { user: true, collection: true }
            })

            if (!cardToBeDeleted) {
                throw new HttpException({ message: 'Card was not found', errorCode: ErrorCodes.CARD_NOT_FOUND }, HttpStatus.NOT_FOUND)
            }

            if (cardToBeDeleted.user.userid !== userid) {
                throw new HttpException({ message: 'User is not authorized to proceed', errorCode: ErrorCodes.AUTH_FAILURE }, HttpStatus.UNAUTHORIZED)
            }

            console.log(`Card "${cardToBeDeleted.front_text}" with ID: ${id} created by user "${cardToBeDeleted.user.username}" is being deleted.`);

            await prisma.card.update({
                where: { id: id },
                data: { deleted_at: new Date()}
            })
            console.log('Card deleted by', userid); 
            const userWithUpdatedCards = await prisma.user.findUnique({ where: {userid: userid }, include: { cards: { where: { deleted_at: null } } } })
            const restOfCards = userWithUpdatedCards?.cards || []
            
            console.log(`Αλλες καρτες απο τον χρηστη ${userWithUpdatedCards?.username}:`)
            if (restOfCards && restOfCards.length > 0) {
                restOfCards.forEach((card) => {
                    console.log(`- ${card.front_text} with (ID: ${card.id})`);
                })
            } else console.log(`${userWithUpdatedCards?.username} does not have any more cards`);

            return;
        } catch (err: any){
            console.log('Card did not get deleted', err);
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async deleteALLCards(userid: string) {
        const user = await prisma.user.findUnique({ 
            where: { userid: userid },
            include: { cards: true } 
        })

        if (!user) {
            throw new HttpException({ message: 'User not found', errorCode: 'USER_NOT_FOUND' }, HttpStatus.NOT_FOUND);
        }

        if (user.cards.length > 0) {
            await prisma.card.deleteMany({
              where: { userId: user.id }
            });
        }
        return;
    }
}
