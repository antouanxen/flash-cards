import { UserService } from 'src/users/providers/users.service';
import { CreateCollectionDto } from '../dtos/create-collection.dto';
import { GetCollectionsDto } from '../dtos/get-collections.dto';
import { collection } from '@prisma/client';
import { UpdateCollectionDto } from '../dtos/update-collection.dto';
import { DeleteCollectionDto } from '../dtos/delete-collection.dto';
import { SynCollectionsForService } from './synCollectionsForService';
export declare class CollectionService {
    private readonly userService;
    private readonly synCollectionsForService;
    constructor(userService: UserService, synCollectionsForService: SynCollectionsForService);
    syncCollectionsFromSQLite(collections: collection[], userid: string): Promise<{
        id: string;
        name: string | null;
        userId: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }[]>;
    createCollection(createCollectionDto: CreateCollectionDto, userid: string): Promise<collection>;
    getAllCollections(getCollectionsDto: GetCollectionsDto, userid: string): Promise<collection[] | string>;
    getSingleCollection(id: string, userid: string): Promise<collection | null>;
    updateCollection(updateCollectionDto: UpdateCollectionDto, userid: string): Promise<UpdateCollectionDto | undefined>;
    deleteCollection(deleteCollectionDto: DeleteCollectionDto, userid: string): Promise<void>;
}
