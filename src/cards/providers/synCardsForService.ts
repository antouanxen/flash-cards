import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { card } from "@prisma/client";
import prisma from "prisma/prisma_Client";
import { SyncCardsDTO } from "../dtos/syncCardsFromSQLite.dto";
import { ErrorCodes } from "src/utils/errorCodes";
import { turnToNull } from "src/utils/turnDeleteAtToNull.function";

@Injectable()
export class SynCardsForService{
    constructor() {}

    public async syncCardsFromSQLite(syncCardsDTO: SyncCardsDTO, userid: string): Promise<card[]> {

        if (!syncCardsDTO || !syncCardsDTO.cards || syncCardsDTO.cards.length === 0) {
            throw new Error('SyncCardsDTO is not properly initialized');
        }    

        const user = await prisma.user.findUnique({ where: { userid: userid } })

        try {
        console.log('Initializing Syncing with the Server');
            const cardsToSync = await prisma.$transaction(async (prisma) => {
                return Promise.all(syncCardsDTO.cards.map(async (card) => {
                    return await prisma.card.upsert({
                        where: { id: card.id },
                        update: { 
                            front_text: card.front_text,
                            back_text: card.back_text,
                            color: card.color,
                            updated_at: card.updated_at,
                            deleted_at: turnToNull(card.deleted_at),
                            collectionId: card.collectionId ? card.collectionId : null,
                            image_name: card.image_name ? card.image_name : null
                        },
                        create: {
                            id: card.id,
                            front_text: card.front_text,
                            back_text: card.back_text,
                            color: card.color,
                            userId: user.id,
                            created_at: card.created_at,
                            updated_at: card.updated_at,
                            deleted_at: turnToNull(card.deleted_at),
                            collectionId: card.collectionId ? card.collectionId : null,
                            image_name: card.image_name ? card.image_name : null
                        },
                    })
                })) 
            })
            return cardsToSync
        } catch (err: any) {
            console.log('Κατι χαλασε στην ολη φαση', err)
            throw new HttpException({message: 'Transaction no bueno', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
} 