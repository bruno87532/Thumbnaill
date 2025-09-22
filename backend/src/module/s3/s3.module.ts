import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";

@Module({
  providers: [
    S3Service,
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
  ],
  exports: [S3Service]
})
export class S3Module { }