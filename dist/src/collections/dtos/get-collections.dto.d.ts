import { card } from "@prisma/client";
export declare class GetCollectionsDto {
    id: string;
    name: string;
    created_at: Date;
    userId: string;
    cards?: card[];
}
