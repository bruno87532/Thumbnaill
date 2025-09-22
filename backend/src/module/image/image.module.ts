import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { S3Module } from "../s3/s3.module";

@Module({
  imports: [
    PrismaModule,
    S3Module
  ],
  controllers: [ImageController],
  exports: [ImageService],
  providers: [
    ImageService,
  ]
})
export class ImageModule { }