import { image } from '@prisma/client';
import { ImageCreateDto } from '../dtos/image-create.dto';
import { GetImagesDto } from '../dtos/image-get.dto';
export declare class ImageService {
    constructor();
    createImage(imageCreateDto: ImageCreateDto): Promise<image>;
    bufferFromBase64(base64: string): Buffer;
    getImageByName(image_name: string): Promise<image | null | string>;
    getAllImages(getImagesDto: GetImagesDto): Promise<image[]>;
    getAllImgsByName(images: image[]): Promise<string[]>;
    sendImageAsBase64(imageId: string): Promise<string | null>;
    getAloneImgAndDelete(image: image): Promise<void>;
}
