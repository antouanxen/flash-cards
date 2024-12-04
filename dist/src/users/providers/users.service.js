"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_Client_1 = require("../../../prisma/prisma_Client");
const errorCodes_1 = require("../../utils/errorCodes");
let UserService = class UserService {
    async getTheUsers(theUsersDto) {
        try {
            const users = await prisma_Client_1.default.user.findMany({ include: { collections: { include: { cards: true } }, cards: true } });
            if (users) {
                console.log('Οι users', users);
                return users;
            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log('error on the server', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findSingleUser(id, userid) {
        try {
            const userWithCollectionsAndCards = await prisma_Client_1.default.user.findUnique({
                where: { id: id },
                include: {
                    collections: { where: { deleted_at: null }, include: { cards: { where: { deleted_at: null } } } },
                    cards: { where: { deleted_at: null } }
                }
            });
            if (!userWithCollectionsAndCards) {
                console.log(`User not found`);
                throw new common_1.HttpException({ message: 'This user was not found', errorCode: errorCodes_1.ErrorCodes.USER_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
            }
            const userCollections = userWithCollectionsAndCards?.collections || [];
            const cardsInCollections = userCollections.flatMap(col => col.cards || []).map(card => card.id);
            const allUserCards = userWithCollectionsAndCards?.cards || [];
            const cardsWithNoCols = allUserCards.filter(card => !cardsInCollections.includes(card.id));
            console.log(`Οι συλλογες του χρηστη ${userWithCollectionsAndCards?.username}`);
            userCollections.forEach((col) => {
                if (col.cards && col.cards.length > 0) {
                    console.log(`- Collection: ${col.name} and (ID: ${col.id}) with cards:`);
                    col.cards.forEach((card) => {
                        if (card) {
                            console.log(`- ${card.front_text} and (ID: ${card.id})`);
                        }
                    });
                }
                else {
                    console.log(`- Collection: ${col.name} and (ID: ${col.id}) has no cards`);
                }
            });
            if (userCollections.length === 0) {
                console.log('That user does not have any collections');
            }
            if (cardsWithNoCols && cardsWithNoCols.length > 0) {
                console.log('And cards with no collection:');
                cardsWithNoCols?.forEach((card) => {
                    console.log(`- ${card.front_text} and (ID: ${card.id})`);
                });
            }
            else if (userCollections.length === 0 && allUserCards.length === 0) {
                console.log(`${userWithCollectionsAndCards?.username} does not have any cards or collections at all`);
            }
            console.log(`-Collections: ${userCollections.length} and -Cards: ${allUserCards.length}.`);
            console.log(`User with username: ${userWithCollectionsAndCards.username}, user ID: ${userWithCollectionsAndCards.id} and Firebase ID: ${userWithCollectionsAndCards.userid} found`);
            return userWithCollectionsAndCards;
        }
        catch (err) {
            console.log('this user not found', err);
            return null;
        }
    }
    async deleteUser(userid) {
        const userToBeDeleted = await prisma_Client_1.default.user.findUnique({ where: { userid: userid } });
        if (!userToBeDeleted) {
            console.log('No user to delete');
            throw new common_1.HttpException({ message: 'This user was not found', errorCode: errorCodes_1.ErrorCodes.USER_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
        }
        if (userToBeDeleted.userid !== userid) {
            throw new common_1.HttpException({ message: 'User is not authorized to proceed', errorCode: errorCodes_1.ErrorCodes.AUTH_FAILURE }, common_1.HttpStatus.UNAUTHORIZED);
        }
        console.log(`User "${userToBeDeleted.username}" with ID: ${userToBeDeleted.id} is being deleted.`);
        try {
            if (userToBeDeleted.userid === userid) {
                await prisma_Client_1.default.user.delete({ where: { userid: userid } });
                console.log('o user διαγραφτηκε');
                return;
            }
        }
        catch (err) {
            console.log('προβλημα με την διαγραφη του user', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=users.service.js.map