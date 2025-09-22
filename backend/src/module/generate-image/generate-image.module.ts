import { Module } from "@nestjs/common";
import { GenerateImageService } from "./generate-image.service";
import { GenaiModule } from "./provider/genai/genai.module";

@Module({
  imports: [GenaiModule],
  exports: [GenerateImageService],
  providers: [GenerateImageService],
})
export class GenerateImageModule { }