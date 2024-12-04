import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { card } from "@prisma/client";

export class GetCollectionsDto {

    @IsUUID()
    @IsString()
    id: string

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    name: string

    @IsDateString()
    @IsOptional()
    created_at: Date

    @IsUUID()
    @IsNotEmpty()
    userId: string

    @IsArray()
    @IsOptional()
    cards?: card[]
}