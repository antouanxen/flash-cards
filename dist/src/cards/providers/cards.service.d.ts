import { CollectionService } from 'src/collections/providers/collections.service';
import { CreateCardDto } from '../dtos/create-card.dto';
import { card } from '@prisma/client';
import { GetCardsDto } from '../dtos/get-cards.dto';
import { UpdateCardDto } from '../dtos/update-card.dto';
import { Back_Text_Truncated } from 'src/utils/Card_Back_Text_Truncated';
import { FindCardByIdDTO } from '../dtos/find-cardById.dto';
import { SynCardsForService } from './synCardsForService';
import { ImageService } from 'src/image/providers/image.service';
export declare class CardsService {
    private readonly collectionService;
    private readonly synCardsForService;
    private readonly imageService;
    constructor(collectionService: CollectionService, synCardsForService: SynCardsForService, imageService: ImageService);
    backTextShort: Back_Text_Truncated;
    syncCardsFromSQLite(cards: card[], userid: string): Promise<card[]>;
    createCard(createCardDto: CreateCardDto, userid: string): Promise<card>;
    getAllCards(getCardsDto: GetCardsDto, userid: string): Promise<({
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
    getSingleCard(findCardByIdDto: FindCardByIdDTO, userid: string): Promise<{
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
    updateCard(updateCardDto: UpdateCardDto, userid: string): Promise<UpdateCardDto>;
    deleteCard(id: string, userid: string): Promise<void>;
    deleteALLCards(userid: string): Promise<void>;
}
