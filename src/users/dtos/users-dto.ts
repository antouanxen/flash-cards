import { card, collection } from "@prisma/client"
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator"
import { IsUnique } from "src/utils/ uniqValidator"

export class TheUsersDto {
    
    @IsUUID()
    @IsNotEmpty()
    id: string

    @IsString()
    @Length(3, 50)
    username: string

    @IsEmail()
    @IsNotEmpty()
    @IsUnique('user', 'email')
    email: string

    @IsString()
    @IsNotEmpty()
    @IsUnique('user', 'userid')
    firebaseUid: string

    @IsDateString()
    created_at: Date

    @IsArray()
    @IsOptional()
    cards?: card[]

    @IsArray()
    @IsOptional()
    collections?: collection[]
}