"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gettingCardIdForImage = gettingCardIdForImage;
const prisma_Client_1 = require("../../prisma/prisma_Client");
async function gettingCardIdForImage(image_name, cardId) {
    if (!image_name)
        return null;
    const imageToBePaired = await prisma_Client_1.default.image.upsert({
        where: { image_name: image_name },
        update: { cardId: cardId },
        create: { image_name: image_name, cardId: cardId }
    });
    console.log('Πηρε το id της καρτας', cardId);
    return imageToBePaired;
}
//# sourceMappingURL=gettingCardIdForImage.js.map