import prisma from "prisma/prisma_Client";

export async function gettingCardIdForImage(image_name: string, cardId: string) {
    if (!image_name) return null;
    
    const imageToBePaired = await prisma.image.upsert({ 
        where: { image_name: image_name},
        update: { cardId: cardId },
        create: { image_name: image_name, cardId: cardId }
    })
  
    console.log('Πηρε το id της καρτας', cardId)
    return imageToBePaired  
}