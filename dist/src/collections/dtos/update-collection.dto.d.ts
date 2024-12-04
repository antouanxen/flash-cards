import { GetCollectionsDto } from "./get-collections.dto";
import { FindCollectionByIdDTO } from "./find-collectionById.dto";
declare const UpdateCollectionDto_base: import("@nestjs/common").Type<Partial<GetCollectionsDto> & FindCollectionByIdDTO>;
export declare class UpdateCollectionDto extends UpdateCollectionDto_base {
}
export {};
