import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SyncCollectionsDto } from "../dtos/syncCollectionsFromSQLite.dto";
import prisma from "prisma/prisma_Client";
import { ErrorCodes } from "src/utils/errorCodes";
import { turnToNull } from "src/utils/turnDeleteAtToNull.function";

@Injectable()
export class SynCollectionsForService {

    constructor() {}

    public async syncCollectionsFromSQLite(syncCollectionsDto: SyncCollectionsDto, userid: string) {
        
        if (!syncCollectionsDto || !syncCollectionsDto.collections) {
            throw new Error('SyncCardsDTO or its "cards" property is not properly initialized');
        }    
        const user = await prisma.user.findUnique({ where: { userid: userid } })

        console.log('Synced collections')

       try {
           const syncedCollections = await prisma.$transaction(async (prisma) => {
                return Promise.all(syncCollectionsDto.collections.map(async (collection) => {
                    return await prisma.collection.upsert({
                        where: { id: collection.id },
                        update: {
                            name: collection.name,
                            updated_at: collection.updated_at,
                            deleted_at: turnToNull(collection.deleted_at),
                        },
                        create: {
                            id: collection.id,
                            name: collection.name,
                            created_at: collection.created_at,
                            updated_at: collection.updated_at,
                            deleted_at: turnToNull(collection.deleted_at),
                            userId: user.id,
                        },
                    })
                }))  
            })
            return syncedCollections
        } catch (err: any) {
            console.log('Κατι χαλασε στην ολη φαση', err)
            throw new HttpException({message: 'Transaction no bueno', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}