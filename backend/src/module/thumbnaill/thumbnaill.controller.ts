import { Controller, UseGuards, Post, Body, UsePipes, ValidationPipe, Request } from "@nestjs/common";
import { ThumbnaillService } from "./thumbnaill.service";
import { CreateThumbnaillDto } from "./dto/create-thumbnaill.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("thumbnaill")
export class ThumbnaillController {
  constructor (private readonly thumbnaillService: ThumbnaillService) { }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createThumbnaill(@Body() data: CreateThumbnaillDto, @Request() req) {
    return await this.thumbnaillService.createThumbnaill(data, req.user.id)
  }
}
