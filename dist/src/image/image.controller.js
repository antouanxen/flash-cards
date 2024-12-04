"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const common_1 = require("@nestjs/common");
const image_create_dto_1 = require("./dtos/image-create.dto");
const image_service_1 = require("./providers/image.service");
const errorCodes_1 = require("../utils/errorCodes");
const swagger_1 = require("@nestjs/swagger");
const image_get_dto_1 = require("./dtos/image-get.dto");
let ImageController = class ImageController {
    constructor(imageService) {
        this.imageService = imageService;
    }
    async creationOfImage(imageCreateDto, req, res) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const newImage = await this.imageService.createImage(imageCreateDto);
        console.log('Εφτιαξες μια καινουργια εικονα', newImage);
        return res.status(201).send({ message: 'That photo was saved to the database' });
    }
    async getAllImages(getImagesDto, req, res) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const images = await this.imageService.getAllImages(getImagesDto);
        let imagesSent = [];
        for (let image of images) {
            const imageToBeSent = await this.imageService.getImageByName(image.image_name);
            let imageSent = null;
            if (typeof imageToBeSent === 'object' && imageToBeSent !== null) {
                imageSent = await this.imageService.sendImageAsBase64(imageToBeSent.id);
            }
            if (imageSent)
                imagesSent.push(imageSent);
        }
        return res.status(200).json({ message: `A number of ${imagesSent.length} images were found from the database`, imagesSent });
    }
    async getImgsNamesList(getImagesDto, req, res) {
        const userid = req.res.locals.user;
        if (!userid) {
            console.error('User ID is invalid');
            throw new common_1.HttpException({ message: 'User ID is required', errorCode: errorCodes_1.ErrorCodes.INVALID_CREDENTIAL }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const images = await this.imageService.getAllImages(getImagesDto);
        const imagesByName = await this.imageService.getAllImgsByName(images);
        if (imagesByName.length > 0) {
            console.log(`A total number of ${imagesByName.length} images are found by name`);
            res.status(200).json({ imagesByName });
        }
        else
            res.status(200).json([]);
    }
};
exports.ImageController = ImageController;
__decorate([
    (0, common_1.Post)('create-image'),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to create and save a new Image based in base64 form to the database' }),
    (0, swagger_1.ApiBody)({
        description: 'Fill the body requirements as shown below',
        schema: { type: 'object', properties: {
                imgBase64: { type: 'base64', example: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC' },
                image_name: { type: 'string', example: 'image-b0d0cb5c-e0dd-4192-9d13-1c3f0da69749.jpg' }
            }, required: ['imgBase64', 'image_name']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'An image is created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request. Could not make that image' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [image_create_dto_1.ImageCreateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "creationOfImage", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to fetch an Image from the database' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'An image is fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No images were found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [image_get_dto_1.GetImagesDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getAllImages", null);
__decorate([
    (0, common_1.Get)('images-name-list'),
    (0, swagger_1.ApiOperation)({ summary: 'Use this endpoint to fetch all images that are made' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'A number images are fetched successfully by their name from the database' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'User is Unauthorized to proceed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No images were found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'An error occured to the server' }),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [image_get_dto_1.GetImagesDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getImgsNamesList", null);
exports.ImageController = ImageController = __decorate([
    (0, common_1.Controller)('images'),
    (0, swagger_1.ApiTags)('Images'),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], ImageController);
//# sourceMappingURL=image.controller.js.map