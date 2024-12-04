import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class GetAllImagesNamesDto {
    
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    images: string[]
}