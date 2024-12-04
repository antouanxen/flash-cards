import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { ImageCreateDto } from "./dtos/image-create.dto";
import { ImageService } from "./providers/image.service";
import { Request, Response } from "express";
import { ErrorCodes } from "src/utils/errorCodes";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetImagesDto } from "./dtos/image-get.dto";


@Controller('images')
@ApiTags('Images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post('create_image')
    @ApiOperation({ summary: 'Use this endpoint to create and save a new Image based in base64 form to the database' })
    @ApiBody({
        description: 'Fill the body requirements as shown below',
        schema: { type: 'object', properties: {
            imgBase64: { type: 'base64', example: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC'},
            image_name: { type: 'string', example: 'image-b0d0cb5c-e0dd-4192-9d13-1c3f0da69749.jpg' }
        }, required: ['imgBase64', 'image_name']
        }
    })
    @ApiResponse({ status: 201, description: 'An image is created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request. Could not make that image'})
    @ApiResponse({ status: 401, description: 'User is Unauthorized to proceed' })
    @ApiResponse({ status: 500, description: 'An error occured to the server' })
    public async creationOfImage(@Body() imageCreateDto: ImageCreateDto, @Req() req: Request, @Res() res: Response) {
        const userid = (req as any).res.locals.user

        if (!userid) {
            console.error('User ID is invalid');
            throw new HttpException({ message: 'User ID is required', errorCode: ErrorCodes.INVALID_CREDENTIAL }, HttpStatus.UNAUTHORIZED)
        }

        const newImage = await this.imageService.createImage(imageCreateDto)
        console.log('Εφτιαξες μια καινουργια εικονα', newImage)
        
        return res.status(201).send({ message: 'That photo was saved to the database'})
    }

    @Get()
    @ApiOperation({ summary: 'Use this endpoint to fetch an Image from the database' })
    @ApiResponse({ status: 200, description: 'An image is fetched successfully' })
    @ApiResponse({ status: 401, description: 'User is Unauthorized to proceed' })
    @ApiResponse({ status: 404, description: 'No images were found' })
    @ApiResponse({ status: 500, description: 'An error occured to the server' })    
    public async getAllImages(@Req() req: Request, @Res() res: Response) {
        const userid = (req as any).res.locals.user

        if (!userid) {
            console.error('User ID is invalid');
            throw new HttpException({ message: 'User ID is required', errorCode: ErrorCodes.INVALID_CREDENTIAL }, HttpStatus.UNAUTHORIZED)
        }

        const images = await this.imageService.getAllImages()
        let imagesSent: string[] = []

        for (let image of images) {
            const imageToBeSent = await this.imageService.getImageByName(image.image_name)
            let imageSent: string | null = null
            if (typeof imageToBeSent === 'object' && imageToBeSent !== null) {
                imageSent = await this.imageService.sendImageAsBase64(imageToBeSent.id);
            } 
            if (imageSent)
            imagesSent.push(imageSent)
        }
        
        return res.status(200).json({ message: `A number of ${imagesSent.length} images were found from the database`, imagesSent })
    }

    @Get('images_name_list')
    @ApiOperation({ summary: 'Use this endpoint to fetch all images that are made' })
    @ApiResponse({ status: 200, description: 'A number images are fetched successfully by their name from the database' })
    @ApiResponse({ status: 401, description: 'User is Unauthorized to proceed' })
    @ApiResponse({ status: 404, description: 'No images were found' })
    @ApiResponse({ status: 500, description: 'An error occured to the server' })
    public async getImgsNamesList(getImagesDto: GetImagesDto, @Req() req: Request, @Res() res: Response) {
        const userid = (req as any).res.locals.user

        if (!userid) {
            console.error('User ID is invalid');
            throw new HttpException({ message: 'User ID is required', errorCode: ErrorCodes.INVALID_CREDENTIAL }, HttpStatus.UNAUTHORIZED)
        }

        const images = await this.imageService.getAllImages()

        const imagesByName = await this.imageService.getAllImgsByName(images)
        if (imagesByName.length > 0) {
            console.log(`A total number of ${imagesByName.length} images are found by name`);
            res.status(200).json({ imagesByName })
        } else res.status(200).json([])
    }
}