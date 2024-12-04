import { PartialType } from "@nestjs/mapped-types";
import { GetCollectionsDto } from "./get-collections.dto";
import { IntersectionType } from "@nestjs/swagger";
import { FindCollectionByIdDTO } from "./find-collectionById.dto";

export class UpdateCollectionDto extends IntersectionType(PartialType( GetCollectionsDto), FindCollectionByIdDTO) {}