import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { image } from '@prisma/client';
import prisma from 'prisma/prisma_Client';
import { ErrorCodes } from 'src/utils/errorCodes';
import { ImageCreateDto } from '../dtos/image-create.dto';
import { GetImagesDto } from '../dtos/image-get.dto';

@Injectable()
export class ImageService {

    constructor() {}

    public async createImage(imageCreateDto: ImageCreateDto): Promise<image> {
        const { imgBase64, image_name } = imageCreateDto
        const image_data = this.bufferFromBase64(imgBase64)
                
        try {
            const newImage = await prisma.image.create({
                data: {
                    image_data: image_data,
                    image_name: image_name
                }
            })

            return newImage
        } catch(err: any) {
            console.log('Could not create the image', err)
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public bufferFromBase64(base64: string): Buffer {
        return Buffer.from(base64, 'base64')
    }

    public async getImageByName(image_name: string): Promise<image | null | string> {
        if (!image_name) return null
        try {
            const foundImage = await prisma.image.findUnique({ where: { image_name: image_name } })
            if (!foundImage ) return image_name

            return foundImage
        } catch(err: any) {
            console.log('Could not find the image', err)
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async getAllImages(): Promise<image[]> {
       try {
            const imagesFound = await prisma.image.findMany()

            if (imagesFound.length > 0) {
                return imagesFound
            } else return []
       } catch {
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
       }
    }

    public async getAllImgsByName(images: image[]): Promise<string[]> {
        try {
            const imagesList = await prisma.image.findMany({ 
                where: { image_name: { in: images.map(img => img.image_name)} }           
            })
            if (imagesList.length > 0) {
                console.log('Η λιστα με τα ονοματα των εικονων:')
                imagesList.forEach(img => {
                    console.log(' -', img.image_name)
                })
                const imagesNames = imagesList.map(img => img.image_name)
                return imagesNames
            } else {
                return []
            }
        } catch(err: any) {
            console.log('Δεν βρεθηκαν εικονες με τα ονομα τους', err)
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async sendImageAsBase64(imageId: string): Promise<string | null> {
       try {
            const savedImage = await prisma.image.findUnique({
                where: { id: imageId }
            })

            if (!savedImage || !savedImage.image_data) return null

            return savedImage.image_data.toString('base64')
        } catch(err: any) {
            console.log('Could not find the image', err)
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async getAloneImgAndDelete(image: image): Promise<void> {
        if (!image) {
            console.log('Η εικονα δεν βρεθηκε')
            throw new NotFoundException('Image not found')
        }

        try {
            const previousImage = await prisma.image.findUnique({ where: { id: image.id } })
            
            if (previousImage) {
                await prisma.image.delete({ where: { id: previousImage.id }})
                console.log(`Διαγραφτηκε η εξης εικονα: ${previousImage.id}, που δεν ανηκε πλεον σε καποια καρτα`)
                return;
            } 
        } catch(err: any) {
            console.log('Υπηρξε προβλημα στη βαση ή στον σερβερ με τις εικονες', err)
            throw new HttpException({ message: 'An unexpected error occured to the server', errorCode: ErrorCodes.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR)
        } 
    }  
}
