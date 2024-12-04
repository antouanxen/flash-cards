import { card } from "@prisma/client";
import { SyncCardsDTO } from "../dtos/syncCardsFromSQLite.dto";
export declare class SynCardsForService {
    constructor();
    syncCardsFromSQLite(syncCardsDTO: SyncCardsDTO, userid: string): Promise<card[]>;
}
