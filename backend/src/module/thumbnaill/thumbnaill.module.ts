import { Module } from "@nestjs/common";
import { ThumbnaillService } from "./thumbnaill.service";
import { ThumbnaillController } from "./thumbnaill.controller";
import { AiModule } from "../ai/ai.module";
import { ImageModule } from "../image/image.module";
import { GenerateImageModule } from "../generate-image/generate-image.module";
import { ConfigModule } from "../config/config.module";
import { PrismaModule } from "../prisma/prisma.module";
import { S3Module } from "../s3/s3.module";

@Module({
  imports: [
    PrismaModule,
    S3Module,
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