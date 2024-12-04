import { card, collection } from "@prisma/client";
export declare class TheUsersDto {
    id: string;
    username: string;
    email: string;
    firebaseUid: string;
    created_at: Date;
    cards?: card[];
    collections?: collection[];
}
