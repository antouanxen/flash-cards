export type Card = {
    id: string;
    front_text: string;
    back_text: string;
    color: string;
    userId: string;
    collectionId: string;
    image_name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
};
