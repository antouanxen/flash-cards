import { PartialType } from "@nestjs/swagger"
import { IsBase64, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { GetImagesDto } from "./image-get.dto"

export class ImageCreateDto extends PartialType(GetImagesDto){

    @IsBase64()
    @IsNotEmpty()
    imgBase64: string

    @IsString()
    @IsNotEmpty()
    image_name: string

    @IsUUID()
    @IsString()
    cardId?: string
}