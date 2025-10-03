import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AiService } from "../ai/ai.service";
import * as fs from "fs"
import * as path from "path"
import { saveImage } from "src/common/functions/save-image";
import { ConfigService } from "@nestjs/config";
import { DescribeImageDto } from "./dto/describe-image.dto";
import type { Models } from "src/common/types/models";

@Injectable()
export class DescribeThumbnaillService {
  constructor (
    private readonly aiService: AiService,
    private readonly configService: ConfigService,
  ) { }

  async describeImage(image: Express.Multer.File, data: DescribeImageDto) {
    let attemps = 0
    
    try {
      const urlImage = await saveImage(this.configService, image)
      const templatePath = path.join(__dirname, "../../templates/describe-image.template.txt")
      const templateString = fs.readFileSync(templatePath, "utf-8")
      
      async function handleImage(aiService: AiService) {
        const response = await aiService.chatCompletionWithImage(
          templateString, 
          urlImage,
          {
            model: data.model as Models,
          } 
        )
        
        try {
          const parsed = JSON.parse(response.content)
          return parsed
        } catch (error) {
          if (attemps === 3) throw error
          attemps++
          return handleImage(aiService)
        }
      }

      return handleImage(this.aiService)
    } catch (error) {
      console.error("An error ocurred while describing image", error)
      throw new InternalServerErrorException("An error ocurred while describing image")
    }
  } 
}