import { collection } from "@prisma/client";
import prisma from "prisma/prisma_Client";

export async function collectionChangesInBody(colChanges: boolean = true, collection: collection): Promise<String[]> {
    let changes: string[] = []
    const existingCol = await prisma.collection.findUnique({ where: { id: collection.id }})

    if (collection.name !== existingCol.name) {
        changes.push('front_text');
        console.log(`  - Name changed: "${existingCol.name}" => "${collection.name}"`);
    }

    if (collection.deleted_at !== existingCol.deleted_at) {
        changes.push('deleted_at');
        console.log(`  - Deleted_at changed "${existingCol.deleted_at}" => "${collection.deleted_at}"`);
    }

    if (changes.length > 0) {
        console.log(` - Properties changed: ${changes.join(', ')}`)
    } else {
        return;
    }
}