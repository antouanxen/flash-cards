import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { AuthenticateUser } from 'firebase/firebaseAuthentication'
import { CardsModule } from 'src/cards/cards.module';
import { CollectionsModule } from 'src/collections/collections.module';
import { ImageModule } from 'src/image/image.module';


@Module({
  imports: [UsersModule, CardsModule, CollectionsModule, ImageModule],
  controllers: [AppController],
  providers: [AppService, AuthenticateUser],
})

export class AppModule {}
