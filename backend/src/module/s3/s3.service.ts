import { BadRequestException, Injectable, InternalServerErrorException, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand, PutObjectCommandInput, GetObjectCommandInput, GetObjectCommand, DeleteObjectCommandInput, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

@Injectable()
export class S3Service {
  private readonly amazonBucket: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject("s3Client") private readonly s3Client: S3Client,
  ) {
    this.amazonBucket = configService.get<string>("AMAZON_BUCKET") || ""
  }

  async saveImage(params: Omit<PutObjectCommandInput, "Bucket"> & { Bucket?: string }) {
    try {
      const uploadParams: PutObjectCommandInput = {
        ...params,
        Bucket: params.Bucket ?? this.amazonBucket
      }

      const image = await this.s3Client.send(new PutObjectCommand(uploadParams))
      return image
    } catch (error) {
      console.error("An error ocurred while saving image", error)
      throw new InternalServerErrorException("An error ocurred while saving image")
    }
  }

  async getImage(params: Omit<GetObjectCommandInput, "Bucket"> & { Bucket?: string }) {
    try {
      const command = new GetObjectCommand({
        ...params,
        Bucket: params.Bucket ?? this.amazonBucket
      })

      const response = await this.s3Client.send(command)
      if (!response.Body) throw new BadRequestException("Body is required")
      const stream = response.Body as Readable;
      const chunks: Buffer[] = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      return chunks
    } catch (error) {
      console.error("An error ocurred while fetching image", error)
      throw new InternalServerErrorException("An error ocurred while fetching image")
    }
  }

  async deleteImage(params: Omit<DeleteObjectCommandInput, "Bucket"> & { Bucket?: string }) {
    try {
      const command = new DeleteObjectCommand({
        ...params,
        Bucket: params.Bucket ?? this.amazonBucket
      })

      const image = await this.s3Client.send(command)

      return image
    } catch (error) { 
      console.error("An error ocurred while deleting image", error)
      throw new InternalServerErrorException("An error ocurred while deleting image")
    }
  }
}