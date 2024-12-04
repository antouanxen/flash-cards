import { GetCardsDto } from "./get-cards.dto";
import { PartialType } from "@nestjs/mapped-types";

export class CreateCardDto extends PartialType(GetCardsDto) {}