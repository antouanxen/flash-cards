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
exports.CollectionController = void 0;
const common_1 = require("@nestjs/common");
const collections_service_1 = require("./providers/collections.service");
const create_collection_dto_1 = require("./dtos/create-collection.dto");
const errorCodes_1 = require("../utils/errorCodes");
const get_collections_dto_1 = require("./dtos/get-collections.dto");
const find_collectionById_dto_1 = require("./dtos/find-collectionById.dto");
const swagger_1 = require("@nestjs/swagger");
const prisma_Client_1 = require("../../prisma/prisma_Client");
const syncCollectionsFromSQLite_dto_1 = require("./dtos/syncCollectionsFromSQLite.dto");
let CollectionController = class CollectionController {
    constructor(collectionService) {
        this.collectionService = collectionService;
    }
    async syncCollections(syncCollectionsDto, req, res) {
        const userid = req.res.locals.user;
        const { collections } = syncCollectionsDto;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const syncedCollections = await this.collectionService.syncCollectionsFromSQLite(collections, userid);
        if (syncedCollections.length > 0) {
            console.log(`A total number of ${syncedCollections.length} collections have been made and synced with the server`);
            res.status(201).json({ syncedCollections });
        }
        else if (syncedCollections.length === 0) {
            console.log('No collections needed to sync');
            res.status(204).json({ message: 'There was no collections to sync with the server' });
        }
    }
    async createCollection(createCollectionDto, req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            console.log('Φτιαχνεις μια συλλογη');
            const collectionToBeCreated = await this.collectionService.createCollection(createCollectionDto, userid);
            console.log('New collection:', collectionToBeCreated);
            console.log('η συλλογη δημιουργηθηκε');
            const user = await prisma_Client_1.default.user.findUnique({ where: { userid: userid } });
            const userCollections = await prisma_Client_1.default.collection.findMany({ where: { userId: user.id, deleted_at: null } });
            console.log(`Και εχει αλλες ${userCollections.length} ακομα`);
            return collectionToBeCreated;
        }
        catch (err) {
            console.error('Error creating collection', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllCollections(getCollectionsDto, req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        console.log('Εδω παιρνεις ολες τις συλλογες');
        const collections = await this.collectionService.getAllCollections(getCollectionsDto, userid);
        console.log('Τα collections φτασανε');
        console.log('Tο συνολο τους:', collections.length);
        return collections;
    }
    async getCurrentCollection(getCollectionWithId, req) {
        const userid = req.res.locals.user;
        const { id } = getCollectionWithId;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        console.log('Εδω παιρνεις τη συγκεκριμενη συλλογη');
        const singleCollection = await this.collectionService.getSingleCollection(id, userid);
        console.log('The collection:', singleCollection);
        console.log('Oριστε ενα collection');
        return singleCollection;
    }
    async updateCurrentCollection(id, name, req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const updateCollectionDto = { id, name };
        console.log('Εδω ενημερωνεις μια συλλογη');
        const updatedCollection = await this.collectionService.updateCollection(updateCollectionDto, userid);
        console.log('Updated Collection:', updatedCollection);
        console.log('Ενημερωσες ενα collection');
        return updatedCollection;
    }
    async deleteCurrentCollection(id, req) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const deleteCollectionDto = { id };
        console.log('Εδω διαγραφεις μια συλλογη');
        const result = await this.collectionService.deleteCollection(deleteCollectionDto, userid);
        if (typeof result === 'string')
            throw new common_1.HttpException({ message: 'Could not delete that collection', errorCode: errorCodes_1.ErrorCodes.COLLECTION_DELETE_ERROR }, common_1.HttpStatus.BAD_REQUEST);
        console.log('Διεγραψες ενα collection');
    }
};
exports.CollectionController = CollectionController;
__decorate([
    (0, common_1.Post)('sync-collections'),
    (0, swagger_1.ApiOperation)({
        summary: 'Use this endpoint to synchronize a single or a number of collections with the server based on the body, updating the data to the server'
    }),
    (0, swagger_1.ApiBody)({
        description: 'Fill the body requirements as shown below',
        schema: { type: 'object', properties: {
                id: { type: 'string', format: 'uuid', example: 'e1e5a6a3-d42e-4e73-9f37-f9a3a5e598ed', description: 'UUID for each of the collections that get synced to the server generated by the SQLite db' },
                name: { type: 'string', example: 'Abc' },
                created_at: { type: 'string/Date', example: '2024-10-08 14:11:29.802', description: 'It creates a timestamp for the collection created, can be optional' },
                updated_at: { type: 'string/Date', example: '2024-10-08 14:11:29.802', description: 'It creates a timestamp for the collection from the most recent update, can be optional' },
                deleted_at: { type: 'string/Date', example: '2024-10-08 14:11:29.802', description: 'It creates a timestamp for the collection that got soft deleted but still exists in the database, can be null also' },
            } },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'A collection is created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request. Could not make that collection' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [syncCollectionsFromSQLite_dto_1.SyncCollectionsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "syncCollections", null);
__decorate([
    (0, common_1.Post)('create-collection'),
    (0, swagger_1.ApiOperation)({
        summary: 'Use this endpoint to create a collection based on the body'
    }),
    (0, swagger_1.ApiBody)({
        description: 'Fill the body requirements as shown below',
        schema: { type: 'object', properties: {
                name: { type: 'string', example: 'Abc' },
            } }, required: true
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'A collection is created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request. Could not make that collection' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_collection_dto_1.CreateCollectionDto, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "createCollection", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to fetch all collections of the current user based on the token provided by Firebase' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All Collections of the user fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Any collection was not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_collections_dto_1.GetCollectionsDto, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "getAllCollections", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to fetch a single collection of the current user based on the token provided by Firebase' }),
    (0, swagger_1.ApiParam)({ name: 'id', schema: { type: 'string', format: 'uuid', example: '15c2956b-1d27-4282-89da-d83dd7b44a49', description: 'Unique identifier for the resource' }, required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collection of the user fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'That collection was not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_collectionById_dto_1.FindCollectionByIdDTO, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "getCurrentCollection", null);
__decorate([
    (0, common_1.Patch)(':id/update-collection'),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to update a single collection of the current user based on the token provided by Firebase' }),
    (0, swagger_1.ApiBody)({
        description: 'Fill the body requirements as shown below',
        schema: { type: 'object', properties: {
                name: { type: 'string', example: 'Cba' },
            } }, required: true
    }),
    (0, swagger_1.ApiParam)({ name: 'id', schema: { type: 'string', format: 'uuid', example: '15c2956b-1d27-4282-89da-d83dd7b44a49', description: 'Unique identifier for the resource' }, required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collection of the user updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'That collection was not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "updateCurrentCollection", null);
__decorate([
    (0, common_1.Delete)(':id/delete-collection'),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to delete a single collection of the current user based on the token provided by Firebase' }),
    (0, swagger_1.ApiParam)({ name: 'id', schema: { type: 'string', format: 'uuid', example: '15c2956b-1d27-4282-89da-d83dd7b44a49', description: 'Unique identifier for the resource' }, required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collection of the user deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unathorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'That collection was not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "deleteCurrentCollection", null);
exports.CollectionController = CollectionController = __decorate([
    (0, common_1.Controller)('collections'),
    (0, swagger_1.ApiTags)('Collections'),
    __metadata("design:paramtypes", [collections_service_1.CollectionService])
], CollectionController);
//# sourceMappingURL=collections.controller.js.map