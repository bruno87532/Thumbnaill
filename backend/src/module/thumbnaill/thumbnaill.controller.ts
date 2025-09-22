import { Controller, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { ThumbnaillService } from "./thumbnaill.service";
import { CreateThumbnaillDto } from "./dto/create-thumbnaill.dto";

@Controller("thumbnaill")
export class ThumbnaillController {
  constructor (private readonly thumbnaillService: ThumbnaillService) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createThumbnaill(@Body() data: CreateThumbnaillDto) {
    return await this.thumbnaillService.createThumbnaill(data)
  }
}
