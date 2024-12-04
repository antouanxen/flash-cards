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
exports.SynCardsForService = void 0;
const common_1 = require("@nestjs/common");
const prisma_Client_1 = require("../../../prisma/prisma_Client");
const errorCodes_1 = require("../../utils/errorCodes");
const turnDeleteAtToNull_function_1 = require("../../utils/turnDeleteAtToNull.function");
let SynCardsForService = class SynCardsForService {
    constructor() { }
    async syncCardsFromSQLite(syncCardsDTO, userid) {
        if (!syncCardsDTO || !syncCardsDTO.cards || syncCardsDTO.cards.length === 0) {
            throw new Error('SyncCardsDTO is not properly initialized');
        }
        const user = await prisma_Client_1.default.user.findUnique({ where: { userid: userid } });
        try {
            console.log('Initializing Syncing with the Server');
            const cardsToSync = await prisma_Client_1.default.$transaction(async (prisma) => {
                return Promise.all(syncCardsDTO.cards.map(async (card) => {
                    return await prisma.card.upsert({
                        where: { id: card.id },
                        update: {
                            front_text: card.front_text,
                            back_text: card.back_text,
                            color: card.color,
                            updated_at: card.updated_at,
                            deleted_at: (0, turnDeleteAtToNull_function_1.turnToNull)(card.deleted_at),
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
                            deleted_at: (0, turnDeleteAtToNull_function_1.turnToNull)(card.deleted_at),
                            collectionId: card.collectionId ? card.collectionId : null,
                            image_name: card.image_name ? card.image_name : null
                        },
                    });
                }));
            });
            return cardsToSync;
        }
        catch (err) {
            console.log('Κατι χαλασε στην ολη φαση', err);
            throw new common_1.HttpException({ message: 'Transaction no bueno', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SynCardsForService = SynCardsForService;
exports.SynCardsForService = SynCardsForService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SynCardsForService);
//# sourceMappingURL=synCardsForService.js.map