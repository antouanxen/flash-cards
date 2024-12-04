import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { Collection } from "../collection.interface";
import { collection } from "@prisma/client";

export class SyncCollectionsDto {

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    collections: collection[]
}