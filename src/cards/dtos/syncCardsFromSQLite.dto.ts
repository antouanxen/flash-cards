import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { Card } from "../card.interface";
import { card } from "@prisma/client";

export class SyncCardsDTO {

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    cards: card[]
}