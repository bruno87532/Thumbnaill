import { BadRequestException, ForbiddenException, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { v4 as uuid } from "uuid";
import { Readable } from "stream";

@Injectable()
export class ImageService {
  constructor(
    @Inject("s3Client") private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) { }

  async createImage(idUser: string, files: Express.Multer.File[]) {
    if (files.length === 0) throw new BadRequestException("File is required")
    const amazonBucket = this.configService.get<string>("AMAZON_BUCKET") ?? ""

    const images = await Promise.all(
      files.map(async (file) => {
        const key = `${idUser}-${uuid()}`
        const uploadParams = {
          Bucket: amazonBucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype
        }

        await this.s3Client.send(new PutObjectCommand(uploadParams))
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
      const amazonBucket = this.configService.get<string>("AMAZON_BUCKET") ?? ""

      const images = await this.prismaService.image.findMany({
        where: { idUser }
      })

      const imagesFile = await Promise.all(
        images.map(async (image) => {
          const command = new GetObjectCommand({
            Bucket: amazonBucket,
            Key: image.id
          })

          const response = await this.s3Client.send(command)
          if (!response.Body) throw new BadRequestException("Body is required")
          const stream = response.Body as Readable;
          const chunks: Buffer[] = []
          for await (const chunk of stream) {
            chunks.push(chunk)
          }

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
      const amazonBucket = this.configService.get<string>("AMAZON_BUCKET") ?? ""
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
          const command = new GetObjectCommand({
            Bucket: amazonBucket,
            Key: image.id
          })

          const response = await this.s3Client.send(command)
          if (!response.Body) throw new BadRequestException("Body is required")
          const stream = response.Body as Readable;
          const chunks: Buffer[] = []
          for await (const chunk of stream) {
            chunks.push(chunk)
          }

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
      const amazonBucket = this.configService.get<string>("AMAZON_BUCKET") ?? ""
      const image = await this.getImageById(id)
      if (image.idUser !== idUser) throw new ForbiddenException("Access denied for this resource")

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: amazonBucket,
          Key: image.id
        })
      )

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