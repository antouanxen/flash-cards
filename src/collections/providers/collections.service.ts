import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';
import { CreateCollectionDto } from '../dtos/create-collection.dto';
import prisma from 'prisma/prisma_Client';
import { ErrorCodes } from 'src/utils/errorCodes';
import { GetCollectionsDto } from '../dtos/get-collections.dto';
import { collection } from '@prisma/client';
import { UpdateCollectionDto } from '../dtos/update-collection.dto';
import { SynCollectionsForService } from './synCollectionsForService';
import { Collection } from '../collection.interface';
import { collectionChangesInBody } from 'src/utils/CollectionChangesInBody';

@Injectable()
export class CollectionService {
    constructor(
        private readonly synCollectionsForService: SynCollectionsForService
    ) {}

    public async syncCollectionsFromSQLite(collections: collection[], userid: string) {
        let updatedCollections: Collection[] = []
        
        try {    
            console.log(`A number of ${collections.length} collections are ready to sync with the server`)
            for (const col of collections) {
                const existingCol = await prisma.collection.findUnique({ where: { id: col.id } })

                if (!existingCol) {
                    console.log(`Collection with ID ${col.id} does not exist. It will be added.`);
                    updatedCollections.push(col);
                    continue; 
                }

                const colChanges =
                    col.name !== existingCol.name ||
                    col.deleted_at !== existingCol.deleted_at;
                
                if (colChanges) {
                    console.log(`-Collection ${col.id} has changed.`);
                    await collectionChangesInBody(colChanges, col)
                    updatedCollections.push(col); 
                }
            }

            if (updatedCollections.length > 0) {
                console.log('Συλλογες που χρειαστηκαν Syncing:', updatedCollections.length);
                return await this.synCollectionsForService.syncCollectionsFromSQLite({ collections: updatedCollections }, userid)
            } else {
                console.log('No collections have changed, nothing to sync.');
                return []
            }
        } catch(err: any) {
            console.log('Λαθος με το sync των συλλογων', err)
            throw new HttpException({ message: 'Could not sync with the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async createCollection(createCollectionDto: CreateCollectionDto, userid: string): Promise<collection> {
        const user = await prisma.user.findUnique({
                where: {userid: userid}, 
                include: {
                    collections: { include: { cards: true } }, 
                    cards: true
                }    
            })

        if (!user) {
            throw new HttpException({ message: 'This user was not found', errorCode: ErrorCodes.USER_NOT_FOUND }, HttpStatus.NOT_FOUND)
        }

        try {
            const { name } = createCollectionDto
            const newCollection = await prisma.collection.create({
                data: { name: name, userId: user.id },
                include: { cards: true }
            })
            
            return newCollection
        } catch(err: any) {
            console.log('συλλογη δεν δημιουργηθηκε', err);
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.COLLECTION_CREATE_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async getAllCollections(getCollectionsDto: GetCollectionsDto, userid: string): Promise<collection[] | string> {
        try {
            const collections = await prisma.collection.findMany({
                where: { user: { userid: userid}, deleted_at: null },
                include: { cards: true }
            })

            const user = await prisma.user.findUnique({ 
                where: { userid: userid}
            })

            if (collections.length > 0) {
                console.log('Collections:', collections)
                
                const maxCollectionsToSHOW = 15
                collections.slice(0, maxCollectionsToSHOW) 
               
                if (collections.length > maxCollectionsToSHOW) {
                    console.log('και πολλές συλλογές ακόμα...');
                }

                console.log(`Απο τον χρηστη: ${user.userid} με ονομα ${user.username}`);
            
                return collections
            } else {
                return []
            }
        } catch (err: any) {
            console.log('τα collections μεινανε στο δρομο', err);
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async getSingleCollection(id: string, userid: string): Promise<collection | null> {
        try {
            const collection = await prisma.collection.findUnique({ 
                where: { id: id}, 
                include: { cards: true, user: true}
            })
            return collection || null
        } catch (err: any) {
            console.log('δεν βρεθηκε κανενα collection', err)
            throw new HttpException({ message: 'That collection was not found', errorCode: ErrorCodes.COLLECTION_NOT_FOUND }, HttpStatus.NOT_FOUND)
        }
    }

    public async updateCollection(updateCollectionDto: UpdateCollectionDto, userid: string): Promise<UpdateCollectionDto | undefined> {
        try {
            const { id, name } = updateCollectionDto
            const collectionToBeUpdated = await prisma.collection.findUnique({ 
                where: { id: id }, 
                include: { user: true, cards: true}
            })

            if (!collectionToBeUpdated) {
                throw new HttpException({ message: 'Collection was not found', errorCode: ErrorCodes.COLLECTION_NOT_FOUND }, HttpStatus.NOT_FOUND)
            }
            
            if (collectionToBeUpdated.user.userid !== userid) {
                throw new HttpException({ message: 'User is not authorized to proceed', errorCode: ErrorCodes.AUTH_FAILURE }, HttpStatus.UNAUTHORIZED)
            }

            console.log(`Collection "${collectionToBeUpdated.name}" with ID: ${id} created by user "${collectionToBeUpdated.user.username}" is being updated.`);
            
            const updatedCollection = await prisma.collection.update({
                where: { id: id },
                data: { name: name ?? collectionToBeUpdated.name }
            });
            console.log('η συλλογη ενημερωθηκε απο', userid);

            return updatedCollection
        } catch (err: any){
            console.log('συλλογη δεν ενημερωθηκε', err);
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async deleteCollection(collectionId: string, userid: string): Promise<void> {
        try {
            const collectionToBeDeleted = await prisma.collection.findUnique({ 
                where: { id: collectionId}, 
                include: { user: true, cards: true}
            })

            if (!collectionToBeDeleted) {
                throw new HttpException({ message: 'Collection was not found', errorCode: ErrorCodes.COLLECTION_NOT_FOUND }, HttpStatus.NOT_FOUND)
            }

            if (collectionToBeDeleted.user.userid !== userid) {
                throw new HttpException({ message: 'User is not authorized to proceed', errorCode: ErrorCodes.AUTH_FAILURE }, HttpStatus.UNAUTHORIZED)
            }

            console.log(`Collection "${collectionToBeDeleted.name}" with ID: ${collectionId} created by user "${collectionToBeDeleted.user.username}" is being deleted.`);

            await prisma.collection.update({
                where: { id: collectionId },
                data: { deleted_at: new Date() }
            })
            console.log('collection deleted by', userid); 
            
            const userWithUpdatedCollections = await prisma.user.findUnique({ 
                where: { userid: userid }, 
                include: { collections: { where: { deleted_at: null } } } 
            })
            const restOfCollections = userWithUpdatedCollections?.collections || []

            if (restOfCollections && restOfCollections.length > 0) {
                console.log(`Αλλες συλλογες απο τον χρηστη ${userWithUpdatedCollections?.username}:`);
                restOfCollections.forEach((col) => {
                    console.log(`- ${col.name} with (ID: ${col.id})`);
                })
            } else console.log(`${userWithUpdatedCollections?.username} does not have any more collections`);
            
            return;
        } catch (err: any){
            console.log('Collection did not get deleted', err);
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
