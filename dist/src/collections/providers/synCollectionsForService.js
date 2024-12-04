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
exports.SynCollectionsForService = void 0;
const common_1 = require("@nestjs/common");
const prisma_Client_1 = require("../../../prisma/prisma_Client");
const errorCodes_1 = require("../../utils/errorCodes");
const turnDeleteAtToNull_function_1 = require("../../utils/turnDeleteAtToNull.function");
let SynCollectionsForService = class SynCollectionsForService {
    constructor() { }
    async syncCollectionsFromSQLite(syncCollectionsDto, userid) {
        if (!syncCollectionsDto || !syncCollectionsDto.collections) {
            throw new Error('SyncCardsDTO or its "cards" property is not properly initialized');
        }
        const user = await prisma_Client_1.default.user.findUnique({ where: { userid: userid } });
        console.log('Synced collections');
        try {
            const syncedCollections = await prisma_Client_1.default.$transaction(async (prisma) => {
                return Promise.all(syncCollectionsDto.collections.map(async (collection) => {
                    return await prisma.collection.upsert({
                        where: { id: collection.id },
                        update: {
                            name: collection.name,
                            updated_at: collection.updated_at,
                            deleted_at: (0, turnDeleteAtToNull_function_1.turnToNull)(collection.deleted_at),
                        },
                        create: {
                            id: collection.id,
                            name: collection.name,
                            created_at: collection.created_at,
                            updated_at: collection.updated_at,
                            deleted_at: (0, turnDeleteAtToNull_function_1.turnToNull)(collection.deleted_at),
                            userId: user.id,
                        },
                    });
                }));
            });
            return syncedCollections;
        }
        catch (err) {
            console.log('Κατι χαλασε στην ολη φαση', err);
            throw new common_1.HttpException({ message: 'Transaction no bueno', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SynCollectionsForService = SynCollectionsForService;
exports.SynCollectionsForService = SynCollectionsForService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SynCollectionsForService);
//# sourceMappingURL=synCollectionsForService.js.map