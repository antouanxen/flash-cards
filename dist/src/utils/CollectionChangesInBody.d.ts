import { collection } from "@prisma/client";
export declare function collectionChangesInBody(cardChanges: boolean, collection: collection): Promise<String[]>;
