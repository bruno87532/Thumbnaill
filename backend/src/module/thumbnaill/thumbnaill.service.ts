import { Injectable } from "@nestjs/common";
import { CreateThumbnaillDto } from "./dto/create-thumbnaill.dto";
import { AiService } from "../ai/ai.service";
import { ImageService } from "../image/image.service";

@Injectable()
export class ThumbnaillService {
  constructor(
    private readonly aiService: AiService,
    private readonly imageService: ImageService,
  ) { }

  async createThumbnaill(data: CreateThumbnaillDto) {
    if (data.ids.length !== 0) {
      const images = await this.imageService.getImagesByIds(data.ids)
    }
  }
}
