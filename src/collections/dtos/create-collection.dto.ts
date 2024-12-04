import { card } from "@prisma/client";
import { IsArray, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { GetCollectionsDto } from "./get-collections.dto";
import { PartialType } from "@nestjs/mapped-types";

export class CreateCollectionDto extends PartialType(GetCollectionsDto) {}