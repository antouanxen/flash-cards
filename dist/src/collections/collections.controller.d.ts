import { CollectionService } from './providers/collections.service';
import { CreateCollectionDto } from './dtos/create-collection.dto';
import { GetCollectionsDto } from './dtos/get-collections.dto';
import { UpdateCollectionDto } from './dtos/update-collection.dto';
import { FindCollectionByIdDTO } from './dtos/find-collectionById.dto';
import { SyncCollectionsDto } from './dtos/syncCollectionsFromSQLite.dto';
import { Request, Response } from 'express';
export declare class CollectionController {
    private readonly collectionService;
    constructor(collectionService: CollectionService);
    syncCollections(syncCollectionsDto: SyncCollectionsDto, req: Request, res: Response): Promise<void>;
    createCollection(createCollectionDto: CreateCollectionDto, req: Request): Promise<{
        id: string;
        name: string | null;
        userId: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    getAllCollections(getCollectionsDto: GetCollectionsDto, req: Request): Promise<string | {
        id: string;
        name: string | null;
        userId: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }[]>;
    getCurrentCollection(getCollectionWithId: FindCollectionByIdDTO, req: Request): Promise<{
        id: string;
        name: string | null;
        userId: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
    updateCurrentCollection(id: string, name: string, req: Request): Promise<UpdateCollectionDto>;
    deleteCurrentCollection(id: string, req: Request): Promise<void>;
}
