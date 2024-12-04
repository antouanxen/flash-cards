import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, Length, MaxLength } from "class-validator";

export class GetCardsDto {
    @IsUUID()
    @IsNotEmpty()
    id: string

    @IsString()
    @MaxLength(1000)
    @IsNotEmpty()
    front_text: string

    @IsString()
    @MaxLength(1500)
    @IsNotEmpty()
    back_text: string

    @IsString()
    @Length(7)
    @IsNotEmpty()
    color: string

    @IsDateString()
    created_at: Date

    @IsDateString()
    updated_at: Date

    @IsDateString()
    @IsOptional()
    deleted_at: Date

    @IsUUID()
    @IsNotEmpty()
    userId: string

    @IsUUID()
    @IsOptional()
    collectionId?: string | null

    @IsString()
    @IsOptional()
    image_name: string | null

}