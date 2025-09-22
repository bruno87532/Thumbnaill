import { Injectable } from "@nestjs/common";
import { CreateThumbnaillDto } from "./dto/create-thumbnaill.dto";
import { AiService } from "../ai/ai.service";
import { ImageService } from "../image/image.service";
import * as fs from "fs";
import * as path from "path";
import { GenerateImageService } from "../generate-image/generate-image.service";
import { ConfigService } from "../config/config.service";
import { HarmCategory, HarmBlockThreshold } from "@google/genai";
import { mapToHarmCategory } from "src/common/functions/mapToHarmCategory";

@Injectable()
export class ThumbnaillService {
  constructor(
    private readonly aiService: AiService,
    private readonly imageService: ImageService,
    private readonly generateImageService: GenerateImageService,
    private readonly configService: ConfigService
  ) { }

  async createThumbnaill(data: CreateThumbnaillDto, idUser: string) {
    const config = Object.fromEntries(
      Object.entries(
        await this.configService.getConfigByIdUser(idUser)
      ).filter(
        ([key, _]) => key !== "id" && key !== "idUser"
      )
    )

    const categories = Object.entries(config).map(([key, value]) => ({
      category: mapToHarmCategory(key),
      threshold: value as HarmBlockThreshold
    })) as {
      category: HarmCategory,
      threshold: HarmBlockThreshold
    }[]

    const templatePath = path.join(__dirname, "../../templates/refine-prompt.template.txt")
    const templateString = fs.readFileSync(templatePath, "utf-8")

    const response = await this.aiService.chatCompletionWithTemplate(
      templateString,
      {
        prompt: data.prompt
      },
      { model: "gpt-4o", temperature: 1 }
    )

    const inlineData: {
      mimeType: "image/png" | "image/jpeg" | "image/webp",
      data: string
    }[] = []

    if (data.ids.length !== 0) {
      console.log('aqui foi')
      const images = await this.imageService.getImagesByIds(data.ids)
      for (const image of images) {
        inlineData.push({
          mimeType: "image/jpeg",
          data: image.buffer.toString("base64")
        })
      }
    }

    const parsed = JSON.parse(response.content)
    const thumbnaill = await this.generateImageService.createImage(data.prompt, categories, inlineData)
  }
}
