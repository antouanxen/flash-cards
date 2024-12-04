import { CardsService } from './providers/cards.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { GetCardsDto } from './dtos/get-cards.dto';
import { UpdateCardDto } from './dtos/update-card.dto';
import { FindCardByIdDTO } from './dtos/find-cardById.dto';
import { SyncCardsDTO } from './dtos/syncCardsFromSQLite.dto';
import { Request, Response } from 'express';
export declare class CardsController {
    private readonly cardService;
    constructor(cardService: CardsService);
    syncCards(syncCardsDTO: SyncCardsDTO, req: Request, res: Response): Promise<void>;
    createCard(createCardDto: CreateCardDto, req: Request): Promise<{
        id: string;
        front_text: string;
        back_text: string;
        color: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        collectionId: string | null;
        userId: string | null;
        image_name: string | null;
    }>;
    getAllCards(getCardsDto: GetCardsDto, req: Request): Promise<({
        collection: {
            id: string;
            name: string | null;
            userId: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
        };
    } & {
        id: string;
        front_text: string;
        back_text: string;
        color: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        collectionId: string | null;
        userId: string | null;
        image_name: string | null;
    })[]>;
    getSingleCard(findCardByIdDto: FindCardByIdDTO, req: Request): Promise<{
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
    }>;
    updateCurrentCard(id: string, updateCardDto: UpdateCardDto, req: Request): Promise<UpdateCardDto>;
    deleteCurrentCard(id: string, req: Request): Promise<void>;
    deleteAllCards(req: Request): Promise<void>;
}
