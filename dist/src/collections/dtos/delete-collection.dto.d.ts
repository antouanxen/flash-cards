import { GetCollectionsDto } from "./get-collections.dto";
import { FindCollectionByIdDTO } from "./find-collectionById.dto";
declare const DeleteCollectionDto_base: import("@nestjs/common").Type<Partial<GetCollectionsDto> & FindCollectionByIdDTO>;
export declare class DeleteCollectionDto extends DeleteCollectionDto_base {
}
export {};
