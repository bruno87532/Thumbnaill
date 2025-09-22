import { Module } from "@nestjs/common";
import { ThumbnaillService } from "./thumbnaill.service";
import { ThumbnaillController } from "./thumbnaill.controller";
import { AiModule } from "../ai/ai.module";
import { ImageModule } from "../image/image.module";
import { GenerateImageModule } from "../generate-image/generate-image.module";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [
    AiModule,
    ConfigModule,
    ImageModule,
    GenerateImageModule,
  ],
  providers: [
    ThumbnaillService,
  ],
  exports: [ThumbnaillService],
  controllers: [ThumbnaillController]
})
export class ThumbnaillModule { }