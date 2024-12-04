import { SyncCollectionsDto } from "../dtos/syncCollectionsFromSQLite.dto";
export declare class SynCollectionsForService {
    constructor();
    syncCollectionsFromSQLite(syncCollectionsDto: SyncCollectionsDto, userid: string): Promise<{
        id: string;
        name: string | null;
        userId: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }[]>;
}
