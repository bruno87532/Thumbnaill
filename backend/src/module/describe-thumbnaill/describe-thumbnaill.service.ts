import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AiService } from "../ai/ai.service";
import * as fs from "fs"
import * as path from "path"
import { saveImage } from "src/common/functions/save-image";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DescribeThumbnaillService {
  constructor (
    private readonly aiService: AiService,
    private readonly configService: ConfigService,
  ) { }

  async describeImage(image: Express.Multer.File) {
    try {
      const urlImage = await saveImage(this.configService, image)
      const templatePath = path.join(__dirname, "../../templates/describe-thumbnaill.template.txt")
      const templateString = fs.readFileSync(templatePath, "utf-8")
      console.log(templateString)
      const response = await this.aiService.chatCompletionWithImage(
        templateString, 
        urlImage,
        {
          model: "gpt-4o",
          temperature: 0.0
        } 
      )
      console.log(response.content)
      const parsed = JSON.parse(response.content)

      return {
        response: parsed.description
      }
    } catch (error) {
      console.error("An error ocurred while describing image", error)
      throw new InternalServerErrorException("An error ocurred while describing image")
    }
  } 
}