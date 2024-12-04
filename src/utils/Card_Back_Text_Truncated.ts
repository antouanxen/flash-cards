import { Injectable } from "@nestjs/common";
import { card } from "@prisma/client";

@Injectable()
export class Back_Text_Truncated {
    truncateText(text: string, maxLength: number) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }
    
    cardForLogging(card: card, maxLength: number = 50) {
        return {
            ...card,
            back_text: this.truncateText(card.back_text, maxLength)
        }
    };
}