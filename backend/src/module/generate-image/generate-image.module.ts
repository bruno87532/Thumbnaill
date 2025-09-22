import { Module } from "@nestjs/common";
import { GenerateImageService } from "./generate-image.service";
import { GenerateImageController } from "./generate-image.controller";

@Module({
  controllers: [GenerateImageController],
  exports: [GenerateImageService],
  providers: [GenerateImageService],
})
export class GenerateImageModule { }