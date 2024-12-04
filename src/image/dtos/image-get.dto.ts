import { IsBase64, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class GetImagesDto {

    @IsUUID()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsNotEmpty()
    image_name: string

    @IsBase64()
    @IsNotEmpty()
    image_data: string

    @IsDateString()
    created_at: Date

    @IsDateString()
    updated_at: Date

    @IsOptional()
    @IsUUID()
    cardId: string

}