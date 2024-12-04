import prisma from "prisma/prisma_Client";

export async function findCardColAndOverride(card: {
    id: string
    front_text: string; 
    back_text: string; 
    color: string; 
    created_at: Date; 
    updated_at: Date; 
    deleted_at: Date | null; 
    userId: string; 
    collectionId?: string; 
    collection: { id: string, name: string }
    image_name?: string
}) {
    if (card.collectionId) {
        const collection = await prisma.collection.findUnique({
            where: { id: card.collectionId },
            select: { id: true, name: true }
        })
        if (collection) {
            card.collection = {
                id: collection.id,
                name: collection.name || 'Unknown Collection'
            };
        }
        console.log('Collection found:');
        return collection
    } else {
        card.collectionId = null
    }
}