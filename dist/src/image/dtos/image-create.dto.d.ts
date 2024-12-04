import { GetImagesDto } from "./image-get.dto";
declare const ImageCreateDto_base: import("@nestjs/common").Type<Partial<GetImagesDto>>;
export declare class ImageCreateDto extends ImageCreateDto_base {
    imgBase64: string;
    image_name: string;
    cardId?: string;
}
export {};
