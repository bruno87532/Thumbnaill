import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ImageController],
  exports: [ImageService],
  providers: [
    ImageService,
    {
      inject: [ConfigService],
      provide: "s3Client",
      useFactory: (configService: ConfigService) => {
        const amazonId = configService.get<string>("AMAZON_ID") ?? ""
        const amazonApiKey = configService.get<string>("AMAZON_API_KEY") ?? ""
        const amazonRegion = configService.get<string>("AMAZON_REGION") ?? ""

        return new S3Client({
          region: amazonRegion,
          credentials: {
            accessKeyId: amazonId,
            secretAccessKey: amazonApiKey,
          }
        })
      }
    }
  ]
})
export class ImageModule { }