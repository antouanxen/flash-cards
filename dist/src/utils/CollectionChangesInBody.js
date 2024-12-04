"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionChangesInBody = collectionChangesInBody;
const prisma_Client_1 = require("../../prisma/prisma_Client");
async function collectionChangesInBody(cardChanges, collection) {
    cardChanges = true;
    let changes = [];
    const existingCol = await prisma_Client_1.default.collection.findUnique({ where: { id: collection.id } });
    if (collection.name !== existingCol.name) {
        changes.push('front_text');
        console.log(`  - Name changed: "${existingCol.name}" => "${collection.name}"`);
    }
    if (collection.deleted_at !== existingCol.deleted_at) {
        changes.push('deleted_at');
        console.log(`  - Deleted_at changed "${existingCol.deleted_at}" => "${collection.deleted_at}"`);
    }
    if (changes.length > 0) {
        console.log(` - Properties changed: ${changes.join(', ')}`);
    }
    else {
        return;
    }
}
//# sourceMappingURL=CollectionChangesInBody.js.map