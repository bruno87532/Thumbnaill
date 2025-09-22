import { Controller, Request, Put, Body, UsePipes, ValidationPipe, UseGuards } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { UpdateConfigDto } from "./dto/update-config.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("config")
export class ConfigController {
  constructor (private readonly configService: ConfigService) { }

  @Put("/idUser")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateConfigByIdUser(@Request() req, @Body() data: UpdateConfigDto) {
    return await this.configService.updateConfigByIdUser(req.user.id, data)
  }
}