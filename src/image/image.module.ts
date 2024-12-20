import { Module } from '@nestjs/common';
import { ImageService } from './providers/image.service';
import { ImageController } from './image.controller';

@Module({
  imports: [],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService]
})

export class ImageModule {}
