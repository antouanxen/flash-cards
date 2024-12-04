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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_Client_1 = require("../../../prisma/prisma_Client");
const errorCodes_1 = require("../../utils/errorCodes");
let ImageService = class ImageService {
    constructor() { }
    async createImage(imageCreateDto) {
        const { imgBase64, image_name } = imageCreateDto;
        const image_data = this.bufferFromBase64(imgBase64);
        try {
            const newImage = await prisma_Client_1.default.image.create({
                data: {
                    image_data: image_data,
                    image_name: image_name
                }
            });
            return newImage;
        }
        catch (err) {
            console.log('Could not create the image', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    bufferFromBase64(base64) {
        return Buffer.from(base64, 'base64');
    }
    async getImageByName(image_name) {
        if (!image_name)
            return null;
        try {
            const foundImage = await prisma_Client_1.default.image.findUnique({ where: { image_name: image_name } });
            if (!foundImage)
                return image_name;
            return foundImage;
        }
        catch (err) {
            console.log('Could not find the image', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllImages(getImagesDto) {
        try {
            const imagesFound = await prisma_Client_1.default.image.findMany();
            if (imagesFound.length > 0) {
                return imagesFound;
            }
            else
                return [];
        }
        catch {
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllImgsByName(images) {
        try {
            const imgNameList = await prisma_Client_1.default.image.findMany({
                where: { image_name: { in: images.map(img => img.image_name) } }
            });
            if (imgNameList.length > 0) {
                console.log('Η λιστα με τα ονοματα των εικονων:');
                imgNameList.forEach(imgName => {
                    console.log(' -', imgName.image_name);
                });
                const imagesNames = imgNameList.map(img => img.image_name);
                return imagesNames;
            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log('Δεν βρεθηκαν εικονες με τα ονομα τους', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendImageAsBase64(imageId) {
        try {
            const savedImage = await prisma_Client_1.default.image.findUnique({
                where: { id: imageId }
            });
            if (!savedImage || !savedImage.image_data)
                return null;
            return savedImage.image_data.toString('base64');
        }
        catch (err) {
            console.log('Could not find the image', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAloneImgAndDelete(image) {
        if (!image) {
            console.log('Η εικονα δεν βρεθηκε');
            throw new common_1.NotFoundException('Image not found');
        }
        try {
            const previousImage = await prisma_Client_1.default.image.findUnique({ where: { id: image.id } });
            if (previousImage) {
                await prisma_Client_1.default.image.delete({ where: { id: previousImage.id } });
                console.log(`Διαγραφτηκε η εξης εικονα: ${previousImage.id}, που δεν ανηκε πλεον σε καποια καρτα`);
                return;
            }
        }
        catch (err) {
            console.log('Υπηρξε προβλημα στη βαση ή στον σερβερ με τις εικονες', err);
            throw new common_1.HttpException({ message: 'An unexpected error occured to the server', errorCode: errorCodes_1.ErrorCodes.SERVER_ERROR }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ImageService);
//# sourceMappingURL=image.service.js.map