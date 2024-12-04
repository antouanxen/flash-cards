"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCardColAndOverride = findCardColAndOverride;
const prisma_Client_1 = require("../../prisma/prisma_Client");
async function findCardColAndOverride(card) {
    if (card.collectionId) {
        const collection = await prisma_Client_1.default.collection.findUnique({
            where: { id: card.collectionId },
            select: { id: true, name: true }
        });
        if (collection) {
            card.collection = {
                id: collection.id,
                name: collection.name || 'Unknown Collection'
            };
        }
        console.log('Collection found:');
        return collection;
    }
    else {
        card.collectionId = null;
    }
}
//# sourceMappingURL=findCardColAndOverride.js.map