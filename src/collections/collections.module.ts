import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { CollectionController } from './collections.controller';
import { CollectionService } from './providers/collections.service';
import { SynCollectionsForService } from './providers/synCollectionsForService';

@Module({
    imports: [UsersModule],
    controllers: [CollectionController],
    providers: [CollectionService, SynCollectionsForService],
    exports: [CollectionService]
})

export class CollectionsModule {}
