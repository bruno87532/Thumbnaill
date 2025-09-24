import { ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateThumbnaillDto } from "./dto/create-thumbnaill.dto";
import { AiService } from "../ai/ai.service";
import { ImageService } from "../image/image.service";
import * as fs from "fs";
import * as path from "path";
import { GenerateImageService } from "../generate-image/generate-image.service";
import { ConfigService } from "../config/config.service";
import { HarmCategory, HarmBlockThreshold, MediaResolution } from "@google/genai";
import { mapToHarmCategory } from "src/common/functions/mapToHarmCategory";
import { PrismaService } from "../prisma/prisma.service";
import { S3Service } from "../s3/s3.service";
import { v4 as uuid } from "uuid"
import { AspectRatioService } from "../ratio/aspect-ratio.service";

@Injectable()
export class ThumbnaillService {
  constructor(
    private readonly aiService: AiService,
    private readonly imageService: ImageService,
    private readonly generateImageService: GenerateImageService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly aspectRatioService: AspectRatioService,
  ) { }

  async createThumbnaill(data: CreateThumbnaillDto, idUser: string) {
    // const refinedPrompt = await this.handlePrompt(data.prompt, data.ids)
    // console.log(refinedPrompt)
    console.log("aqui foi")
    const aspectRatio = await this.aspectRatioService.getAspectRatioByTypePost(data.aspectRatio)
    const size = await this.s3Service.getImage({
      Key: aspectRatio.id
    })
    console.log(size)

    // const { settings, configWithQuality } = await this.handleConfig(idUser)
    // const inlineData = await this.handleImages(data.ids)
    // const thumbnaill = await this.generateImageService.createImage(data.prompt, settings, inlineData, configWithQuality)
    // let id = ""
    
    // if (thumbnaill?.data) {
    //   const key = idUser + uuid()

    //   const uploadParams = {
    //     Key: key,
    //     Body: thumbnaill.data,
    //     ContentType: "image/png"
    //   }
    //   await this.s3Service.saveImage(uploadParams)
    //   const thumbDb = await this.prismaService.thumbnaill.create({
    //     data: {
    //       id: key,
    //       idUser: idUser
    //     }
    //   })

    //   id = thumbDb.id
    // }

    // return {
    //   buffer: thumbnaill?.data,
    //   thumbnaill: {
    //     id
    //   }
    // }
  }

  private async handleImages(ids: string[]) {
    const inlineData: {
      mimeType: "image/png" | "image/jpeg" | "image/webp",
      data: string
    }[] = []

    if (ids.length !== 0) {
      const { images, imagesFile } = await this.imageService.getImagesByIds(ids)
      for (const image of imagesFile) {
        inlineData.push({
          mimeType: "image/jpeg",
          data: image.buffer.toString("base64")
        })
      }
    }

    return inlineData
  }

  private async handlePrompt(prompt: string, ids: string[]) {
    const templatePath = ids.length > 0 ?
      path.join(__dirname, "../../templates/refine-prompt-image.template.txt") :
      path.join(__dirname, "../../templates/refine-prompt.template.txt")
    const templateString = fs.readFileSync(templatePath, "utf-8")
    
    let descriptions = ""
    if (ids.length > 0) {
      const { images } = await this.imageService.getImagesByIds(ids) 
      descriptions = images.map((image, index) => `Image ${index}: ${image.description}\n-----`).join("\n")
    }
    const response = await this.aiService.chatCompletionWithTemplate(
      templateString,
      {
        prompt,
        ...(ids.length > 0 ? {descriptions} : {})
      },
      { model: "gpt-4o", temperature: 1 }
    )

    const parsed = JSON.parse(response.content)
    return parsed.refinedPrompt
  }

  private async handleConfig(idUser: string) {
    const config = await this.configService.getConfigByIdUser(idUser)
    const configWithoutQuality = Object.fromEntries(
      Object.entries(
        config
      ).filter(
        ([key, _]) => key !== "id" && key !== "idUser" && key !== "qualityMode"
      )
    )

    const configWithQuality = config.qualityMode as MediaResolution
    const settings = Object.entries(configWithoutQuality).map(([key, value]) => ({
      category: mapToHarmCategory(key),
      threshold: value as HarmBlockThreshold
    })) as {
      category: HarmCategory,
      threshold: HarmBlockThreshold
    }[]

    return { configWithQuality, settings }
  }

  async getThumbnaillsByIdUser(idUser: string) {
    try {
      const thumbnaiils = await this.prismaService.thumbnaill.findMany({
        where: {
          idUser
        }
      })

      const imagesFile = await Promise.all(
        thumbnaiils.map(async (image) => {
          const chunks = await this.s3Service.getImage({
            Key: image.id
          })

          return {
            id: image.id,
            buffer: Buffer.concat(chunks)
          }
        })
      )
      return {
        imagesFile,
        count: await this.prismaService.thumbnaill.count()
      }
    } catch (error) {
      console.error("An error ocurred while fetching thumbnaiils with idUser", idUser, error)
      throw new InternalServerErrorException("An error ocurred while fetching thumbnaiils with idUser")
    }
  }

  async getThumbnaillById(id: string) {
    try {
      const thumbnaiil = await this.prismaService.thumbnaill.findUnique({
        where: { id }
      })

      if (!thumbnaiil) throw new NotFoundException("Thumbnaill not found")

      return thumbnaiil
    } catch (error) {
      if (error instanceof HttpException) throw error
      console.error("An error ocurred while fetching thumbnaill by id", id, error)
      throw new InternalServerErrorException("An error ocurred while fetching thumbnaill by id")
    }
  }

  async deleteThumbnaillById(idUser: string, id: string) {
    try {
      const thumbnaiil = await this.getThumbnaillById(id)
      if (thumbnaiil.idUser !== idUser) throw new ForbiddenException("Access denied for this resource")

      await this.s3Service.deleteImage({
        Key: thumbnaiil.id
      })

      const thumbnaiilDeleted = await this.prismaService.thumbnaill.delete({
        where: { id }
      })

      return thumbnaiilDeleted
    } catch (error) {
      if (error instanceof HttpException) throw error
      console.error("An error ocurred while deleting thumbnaill with id", id, error)
      throw new InternalServerErrorException("An error ocurred while deleting thumbnaill with id")
    }
  }
}
