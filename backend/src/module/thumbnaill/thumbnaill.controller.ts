import { Controller, Get, UseGuards, Post, Body, UsePipes, Delete, Param, ValidationPipe, Request } from "@nestjs/common";
import { ThumbnaillService } from "./thumbnaill.service";
import { CreateThumbnaillDto } from "./dto/create-thumbnaill.dto";
import { AuthGuard } from "@nestjs/passport";
import { ImprovePromptDto } from "./dto/improve-prompt.dto";

@Controller("thumbnaill")
export class ThumbnaillController {
  constructor(private readonly thumbnaillService: ThumbnaillService) { }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createThumbnaill(@Body() data: CreateThumbnaillDto, @Request() req) {
    return await this.thumbnaillService.createThumbnaill(data, req.user.id)
  }

  @Post("/improve-prompt")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async improvePrompt(@Body() data: ImprovePromptDto) {
    return await this.thumbnaillService.improvePrompt(data)
  }

  @Get("/idUser")
  @UseGuards(AuthGuard("jwt"))
  async getThumbnaillsByIdUser(@Request() req) {
    return await this.thumbnaillService.getThumbnaillsByIdUser(req.user.id)
  }

  @Delete("/:id")
  @UseGuards(AuthGuard("jwt"))
  async deleteImageById(@Request() req, @Param("id") id: string) {
    return await this.thumbnaillService.deleteThumbnaillById(req.user.id, id)
  }
}
