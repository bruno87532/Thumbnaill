import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { v4 as uuid } from "uuid";
import { S3Service } from "../s3/s3.service";

@Injectable()
export class ImageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service
  ) { }

  async createImage(idUser: string, files: Express.Multer.File[]) {
    if (files.length === 0) throw new BadRequestException("File is required")

    const images = await Promise.all(
      files.map(async (file) => {
        const key = `${idUser}-${uuid()}`
        const uploadParams = {
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype
        }

        await this.s3Service.saveImage(uploadParams)

        const image = await this.prismaService.image.create({
          data: {
            id: key,
            idUser
          }
        })

        return image
      })
    )

    return images
  }

  async getImagesByIdUser(idUser: string) {
    try {
      const images = await this.prismaService.image.findMany({
        where: { idUser }
      })

      const imagesFile = await Promise.all(
        images.map(async (image) => {
          const chunks = await this.s3Service.getImage({
            Key: image.id
          })

          return {
            id: image.id,
            buffer: Buffer.concat(chunks)
          }
        })
      )
      return imagesFile
    } catch (error) {
      console.error("An error ocurred while fetching images with idUser", idUser, error)
      throw new InternalServerErrorException("An error ocurred while fetching images with idUser")
    }
  }

  async getImageById(id: string) {
    try {
      const image = await this.prismaService.image.findUnique({
        where: { id }
      })

      if (!image) throw new NotFoundException("Image not found")

      return image
    } catch (error) {
      if (error instanceof HttpException) throw error
      console.error("An error ocurred while fetching image by id", id, error)
      throw new InternalServerErrorException("An error ocurred while fetching image by id")
    }
  }

  async getImagesByIds(ids: string[]) {
    try {
      const images = await this.prismaService.image.findMany({
        where: {
          id: {
            in: ids
          }
        }
      })

      if (images.length !== ids.length) throw new BadRequestException("One or more images were not found")

      const imagesFile = await Promise.all(
        images.map(async (image) => {
          const chunks = await this.s3Service.getImage({
            Key: image.id
          })

          return {
            id: image.id,
            buffer: Buffer.concat(chunks)
          }
        })
      )

      return imagesFile
    } catch (error) {
      console.error("An error ocurred while fetching images with ids", error)
      throw new InternalServerErrorException("An error ocurred while fetching images with ids")
    }
  }

  async deleteImageById(idUser: string, id: string) {
    try {
      const image = await this.getImageById(id)
      if (image.idUser !== idUser) throw new ForbiddenException("Access denied for this resource")

      await this.s3Service.deleteImage({
        Key: image.id
      })

      const imageDeleted = await this.prismaService.image.delete({
        where: { id }
      })

      return imageDeleted
    } catch (error) {
      if (error instanceof HttpException) throw error
      console.error("An error ocurred while deleting image with id", id, error)
      throw new InternalServerErrorException("An error ocurred while deleting image with id")
    }
  }
}