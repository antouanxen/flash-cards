export declare function gettingCardIdForImage(image_name: string, cardId: string): Promise<{
    id: string;
    image_name: string | null;
    created_at: Date;
    updated_at: Date;
    cardId: string | null;
    image_data: Buffer | null;
}>;
