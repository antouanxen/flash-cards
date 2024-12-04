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
exports.CollectionService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/providers/users.service");
const prisma_Client_1 = require("../../../prisma/prisma_Client");
const errorCodes_1 = require("../../utils/errorCodes");
const synCollectionsForService_1 = require("./synCollectionsForService");
const CollectionChangesInBody_1 = require("../../utils/CollectionChangesInBody");
let CollectionService = class CollectionService {
    constructor(userService, synCollectionsForService) {
        this.userService = userService;
        this.synCollectionsForService = synCollectionsForService;
    }
    async syncCollectionsFromSQLite(collections, userid) {
        let updatedCollections = [];
        try {
            console.log(`A number of ${collections.length} collections are ready to sync with the server`);
            for (const col of collections) {
                const existingCol = await prisma_Client_1.default.collection.findUnique({ where: { id: col.id } });
                if (!existingCol) {
                    console.log(`Collection with ID ${col.id} does not exist. It will be added.`);
                    updatedCollections.push(col);
                    continue;
                }
                const colChanges = col.name !== existingCol.name ||
                    col.deleted_at !== existingCol.deleted_at;
                if (colChanges) {
                    console.log(`-Collection ${col.id} has changed.`);
                    await (0, CollectionChangesInBody_1.collectionChangesInBody)(colChanges, col);
                    updatedCollections.push(col);
                }
            }
            if (updatedCollections.length > 0) {
                console.log('Συλλογες που χρειαστηκαν Syncing:', updatedCollections.length);
                return await this.synCollectionsForService.syncCollectionsFromSQLite({ collections: updatedCollections }, userid);
            }
            else {
                console.log('No collections have changed, nothing to sync.');
                return [];
            }
        }
        catch (err) {
            console.log('Λαθος με το sync των συλλογων', err);
            throw new common_1.HttpException({ message: 'Could not sync with the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCollection(createCollectionDto, userid) {
        const user = await prisma_Client_1.default.user.findUnique({
            where: { userid: userid },
            include: {
                collections: { include: { cards: true } },
                cards: true
            }
        });
        if (!user) {
            throw new common_1.HttpException({ message: 'This user was not found', errorCode: errorCodes_1.ErrorCodes.USER_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
        }
        try {
            const { name } = createCollectionDto;
            const newCollection = await prisma_Client_1.default.collection.create({
                data: { name: name, userId: user.id },
                include: { cards: true }
            });
            return newCollection;
        }
        catch (err) {
            console.log('συλλογη δεν δημιουργηθηκε', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.COLLECTION_CREATE_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllCollections(getCollectionsDto, userid) {
        try {
            const collections = await prisma_Client_1.default.collection.findMany({
                where: { user: { userid: userid }, deleted_at: null },
                include: { cards: true }
            });
            const user = await prisma_Client_1.default.user.findUnique({
                where: { userid: userid }
            });
            if (collections.length > 0) {
                console.log('Collections:', collections);
                const maxCollectionsToSHOW = 15;
                collections.slice(0, maxCollectionsToSHOW);
                if (collections.length > maxCollectionsToSHOW) {
                    console.log('και πολλές συλλογές ακόμα...');
                }
                console.log(`Απο τον χρηστη: ${user.userid} με ονομα ${user.username}`);
                return collections;
            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log('τα collections μεινανε στο δρομο', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSingleCollection(id, userid) {
        try {
            const collection = await prisma_Client_1.default.collection.findUnique({
                where: { id: id },
                include: { cards: true, user: true }
            });
            return collection || null;
        }
        catch (err) {
            console.log('δεν βρεθηκε κανενα collection', err);
            throw new common_1.HttpException({ message: 'That collection was not found', errorCode: errorCodes_1.ErrorCodes.COLLECTION_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async updateCollection(updateCollectionDto, userid) {
        try {
            const { id, name } = updateCollectionDto;
            const collectionToBeUpdated = await prisma_Client_1.default.collection.findUnique({
                where: { id: id },
                include: { user: true, cards: true }
            });
            if (!collectionToBeUpdated) {
                throw new common_1.HttpException({ message: 'Collection was not found', errorCode: errorCodes_1.ErrorCodes.COLLECTION_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
            }
            if (collectionToBeUpdated.user.userid !== userid) {
                throw new common_1.HttpException({ message: 'User is not authorized to proceed', errorCode: errorCodes_1.ErrorCodes.AUTH_FAILURE }, common_1.HttpStatus.UNAUTHORIZED);
            }
            console.log(`Collection "${collectionToBeUpdated.name}" with ID: ${id} created by user "${collectionToBeUpdated.user.username}" is being updated.`);
            const updatedCollection = await prisma_Client_1.default.collection.update({
                where: { id: id },
                data: { name: name ?? collectionToBeUpdated.name }
            });
            console.log('η συλλογη ενημερωθηκε απο', userid);
            return updatedCollection;
        }
        catch (err) {
            console.log('συλλογη δεν ενημερωθηκε', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCollection(deleteCollectionDto, userid) {
        try {
            const { id } = deleteCollectionDto;
            const collectionToBeDeleted = await prisma_Client_1.default.collection.findUnique({
                where: { id: id },
                include: { user: true, cards: true }
            });
            if (!collectionToBeDeleted) {
                throw new common_1.HttpException({ message: 'Collection was not found', errorCode: errorCodes_1.ErrorCodes.COLLECTION_NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
            }
            if (collectionToBeDeleted.user.userid !== userid) {
                throw new common_1.HttpException({ message: 'User is not authorized to proceed', errorCode: errorCodes_1.ErrorCodes.AUTH_FAILURE }, common_1.HttpStatus.UNAUTHORIZED);
            }
            console.log(`Collection "${collectionToBeDeleted.name}" with ID: ${id} created by user "${collectionToBeDeleted.user.username}" is being deleted.`);
            await prisma_Client_1.default.collection.update({
                where: { id: id },
                data: { deleted_at: new Date() }
            });
            console.log('collection deleted by', userid);
            const userWithUpdatedCollections = await prisma_Client_1.default.user.findUnique({
                where: { userid: userid },
                include: { collections: { where: { deleted_at: null } } }
            });
            const restOfCollections = userWithUpdatedCollections?.collections || [];
            console.log(`Αλλες συλλογες απο τον χρηστη ${userWithUpdatedCollections?.username}:`);
            if (restOfCollections && restOfCollections.length > 0) {
                restOfCollections.forEach((col) => {
                    console.log(`- ${col.name} with (ID: ${col.id})`);
                });
            }
            else
                console.log(`${userWithUpdatedCollections?.username} does not have any more collections`);
            return;
        }
        catch (err) {
            console.log('Collection did not get deleted', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CollectionService = CollectionService;
exports.CollectionService = CollectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UserService,
        synCollectionsForService_1.SynCollectionsForService])
], CollectionService);
//# sourceMappingURL=collections.service.js.map