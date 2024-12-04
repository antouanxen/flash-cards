"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardChangesInBody = cardChangesInBody;
const prisma_Client_1 = require("../../prisma/prisma_Client");
async function cardChangesInBody(cardChanges = true, card) {
    let changes = [];
    const existingCard = await prisma_Client_1.default.card.findUnique({ where: { id: card.id } });
    if (card.front_text !== existingCard.front_text) {
        changes.push('front_text');
        console.log(`  - Front text changed: "${existingCard.front_text}" => "${card.front_text}"`);
    }
    if (card.back_text !== existingCard.back_text) {
        changes.push('back_text');
        console.log(`  - Back text changed: "${existingCard.back_text}" => "${card.back_text}"`);
    }
    if (card.color !== existingCard.color) {
        changes.push('color');
        console.log(`  - Color changed: "${existingCard.color}" => "${card.color}"`);
    }
    if (card.deleted_at !== existingCard.deleted_at) {
        changes.push('deleted_at');
        console.log(`  - Deleted_at changed: "${existingCard.deleted_at}" => "${card.deleted_at}"`);
    }
    if (card.collectionId !== existingCard.collectionId) {
        changes.push('collectionId');
        console.log(`  - CollectionId changed: "${existingCard.collectionId}" => "${card.collectionId}"`);
    }
    if (card.image_name !== existingCard.image_name) {
        changes.push('image_name');
        console.log(`  - Image_name changed: "${existingCard.image_name}" => "${card.image_name}"`);
    }
    if (changes.length > 0) {
        console.log(` - Properties changed: ${changes.join(', ')}`);
    }
    else {
        return;
    }
}
//# sourceMappingURL=CardChangesInBody.js.map