import { PartialType } from "@nestjs/mapped-types";
import { GetCardsDto } from "./get-cards.dto";

export class UpdateCardDto extends PartialType(GetCardsDto){}