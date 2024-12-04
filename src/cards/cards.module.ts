import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { CardsController } from './cards.controller';
import { CardsService } from './providers/cards.service';
import { CollectionsModule } from 'src/collections/collections.module';
import { Back_Text_Truncated } from 'src/utils/Card_Back_Text_Truncated';
import { SynCardsForService } from './providers/synCardsForService';
import { ImageModule } from 'src/image/image.module';

@Module({
    imports: [UsersModule, CollectionsModule, ImageModule],
    controllers: [CardsController],
    providers: [CardsService, Back_Text_Truncated, SynCardsForService],
    exports: [CardsService]
})

export class CardsModule {}
