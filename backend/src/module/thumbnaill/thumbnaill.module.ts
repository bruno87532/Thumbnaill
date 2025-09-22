import { Module } from "@nestjs/common";
import { ThumbnaillService } from "./thumbnaill.service";
import { ThumbnaillController } from "./thumbnaill.controller";
import { AiModule } from "../ai/ai.module";
import { ImageModule } from "../image/image.module";

@Module({
  imports: [
    AiModule,
    ImageModule,
  ],
  providers: [
    ThumbnaillService,
  ],
  exports: [ThumbnaillService],
  controllers: [ThumbnaillController]
})
export class ThumbnaillModule { }