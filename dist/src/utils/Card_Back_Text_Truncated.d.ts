import { card } from "@prisma/client";
export declare class Back_Text_Truncated {
    truncateText(text: string, maxLength: number): string;
    cardForLogging(card: card, maxLength?: number): {
        back_text: string;
        id: string;
        front_text: string;
        color: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        collectionId: string | null;
        userId: string | null;
        image_name: string | null;
    };
}
