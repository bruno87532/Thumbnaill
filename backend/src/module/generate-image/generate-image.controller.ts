import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("generate-image")
export class GenerateImageController {
  
  @Post()
  @UseGuards(AuthGuard("jwt"))
  async generateImage() {
  }
}