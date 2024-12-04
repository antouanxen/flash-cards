import {  IsOptional, IsString, IsUUID} from "class-validator";

export class FindCollectionByIdDTO {

    @IsUUID()
    @IsString()
    @IsOptional()
    id?: string | null

}