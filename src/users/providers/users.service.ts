import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'prisma/prisma_Client'
import { user } from '@prisma/client'
import { ErrorCodes } from 'src/utils/errorCodes';
import { TheUsersDto } from '../dtos/users-dto';

@Injectable() 
export class UserService {
    public async getTheUsers(theUsersDto: TheUsersDto): Promise<user[]> {
        try {
            const users = await prisma.user.findMany({ 
                include: { 
                    collections: { 
                        include: { cards: true } 
                    }, 
                    cards: true 
                }  
            })
            
            if (users) {
                console.log('Οι users', users)
                return users
            }
            else return []
        } catch (err) {
            console.log('error on the server', err)
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findSingleUser(id: string, userid: string): Promise<user | null> {
        try {
            const userWithCollectionsAndCards = await prisma.user.findUnique({
                where: {id: id}, 
                include: {
                    collections: { where: { deleted_at: null }, include: { cards: { where: { deleted_at: null } } } }, 
                    cards: { where: { deleted_at: null } }
                }    
            })

            if (!userWithCollectionsAndCards) {
                console.log(`User not found`)
                throw new HttpException({ message: 'This user was not found', errorCode: ErrorCodes.USER_NOT_FOUND }, HttpStatus.NOT_FOUND)
            }

            const userCollections = userWithCollectionsAndCards?.collections || []
            const cardsInCollections = userCollections.flatMap(col => col.cards || []).map(card => card.id)
            const allUserCards = userWithCollectionsAndCards?.cards || []
            const cardsWithNoCols = allUserCards.filter(card => !cardsInCollections.includes(card.id))
            
            if (userCollections.length === 0 && allUserCards.length === 0) {
                console.log(`${userWithCollectionsAndCards?.username} does not have any cards or collections at all`)
            } else if (userCollections.length === 0) console.log(`${userWithCollectionsAndCards?.username} does not have any collections`)
            
            console.log(`Οι συλλογες του χρηστη ${userWithCollectionsAndCards?.username}`);
            userCollections.forEach((col) => {
                if (col.cards && col.cards.length > 0) {
                    console.log(`- Collection: ${col.name} and (ID: ${col.id}) with cards:`);
                    col.cards.forEach((card) => {
                        if (card) {
                            console.log(`- ${card.front_text} and (ID: ${card.id})`);
                        }
                    })
                } else {
                    console.log(`- Collection: ${col.name} and (ID: ${col.id}) has no cards`);
                }
            });
            
            if (cardsWithNoCols && cardsWithNoCols.length > 0) {
                console.log('And cards with no collection:');
                cardsWithNoCols?.forEach((card) => {
                    console.log(`- ${card.front_text} and (ID: ${card.id})`);
                })
            } else if (userCollections.length === 0 && allUserCards.length === 0) {
                console.log(`${userWithCollectionsAndCards?.username} does not have any cards or collections at all`);
            }
            
            console.log(`-Collections: ${userCollections.length} and -Cards: ${allUserCards.length}.`);
            
            console.log(`User with username: ${userWithCollectionsAndCards.username}, user ID: ${userWithCollectionsAndCards.id} and Firebase ID: ${userWithCollectionsAndCards.userid} found`)

            return userWithCollectionsAndCards
        } catch (err: any) {
            console.log('this user not found', err);
            return null
        }
    }

    async deleteUser(userid: string): Promise<void | string> {
        const userToBeDeleted = await prisma.user.findUnique({ where: { userid: userid } })

        if (!userToBeDeleted) {
            console.log('No user to delete');
            throw new HttpException({ message: 'This user was not found', errorCode: ErrorCodes.USER_NOT_FOUND }, HttpStatus.NOT_FOUND)
        }

        if (userToBeDeleted.userid !== userid) {
            throw new HttpException({ message: 'User is not authorized to proceed', errorCode: ErrorCodes.AUTH_FAILURE }, HttpStatus.UNAUTHORIZED)
        }

        console.log(`User "${userToBeDeleted.username}" with ID: ${userToBeDeleted.id} is being deleted.`);
        try {
            if (userToBeDeleted.userid === userid) {
                await prisma.user.delete({ where: { userid: userid } })
                console.log('o user διαγραφτηκε');

                return;
            } 
        } catch (err: any) {
            console.log('προβλημα με την διαγραφη του user', err);
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}