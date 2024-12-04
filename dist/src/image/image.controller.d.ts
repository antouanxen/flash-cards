import { ImageCreateDto } from "./dtos/image-create.dto";
import { ImageService } from "./providers/image.service";
import { Request, Response } from "express";
import { GetImagesDto } from "./dtos/image-get.dto";
export declare class ImageController {
    private readonly imageService;
    constructor(imageService: ImageService);
    creationOfImage(imageCreateDto: ImageCreateDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllImages(getImagesDto: GetImagesDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getImgsNamesList(getImagesDto: GetImagesDto, req: Request, res: Response): Promise<void>;
}
