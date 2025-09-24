import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { v4 as uuid } from "uuid";
import { S3Service } from "../s3/s3.service";
import * as path from "path";
import * as fs from "fs";
import { ConfigService } from "@nestjs/config";
import { AiService } from "../ai/ai.service";

@Injectable()
export class ImageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    private readonly aiService: AiService,
  ) { }

  async createImage(idUser: string, files: Express.Multer.File[]) {
    if (files.length === 0) throw new BadRequestException("File is required")
    const results = await Promise.all(
      files.map(async (file) => {
        // const description = await this.handleTemporaryImage(files[0])
        const key = `${idUser}-${uuid()}`
        const uploadParams = {
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype
        }

        const imageFile = await this.s3Service.saveImage(uploadParams)
        const image = await this.prismaService.image.create({
          data: {
            id: key,
            idUser,
          }
        })

        return { image, imageFile }
      })
    )

    const images = results.map((result) => result.image)
    const ids = images.map((image) => image.id)
    const { imagesFile } = await this.getImagesByIds(ids)

    return {
      images,
      imagesFile
    }
  }

  private async handleTemporaryImage(file: Express.Multer.File) {
    const server = this.configService.get<string>("SERVER_IMG")
    const uploadPath = path.join(process.cwd(), "./images")
    const fileName = `${new Date().getTime()}-${uuid()}.png`
    const filePath = path.join(uploadPath, fileName)
    await fs.promises.mkdir(uploadPath, { recursive: true })
    await fs.promises.writeFile(filePath, file.buffer)

    const templatePath = path.join(process.cwd(), "./src/templates/describe-image.template.txt")
    const templateString = fs.readFileSync(templatePath, "utf-8")
    const urlImage = `${server}/images/${fileName}`
    const response = await this.aiService.chatCompletionWithImage(templateString, urlImage, {
      model: "gpt-4o",
      temperature: 0
    })
    const parsed = JSON.parse(response.content)

    return parsed.response
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

      return { imagesFile, images }
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