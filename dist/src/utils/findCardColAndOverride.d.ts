export declare function findCardColAndOverride(card: {
    id: string;
    front_text: string;
    back_text: string;
    color: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    userId: string;
    collectionId?: string;
    collection: {
        id: string;
        name: string;
    };
    image_name?: string;
}): Promise<{
    id: string;
    name: string;
}>;
