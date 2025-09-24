import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ratio } from "@prisma/client";

@Injectable()
export class AspectRatioService {
  constructor(private readonly prismaService: PrismaService) { }

  async getAspectRatioByTypePost(typePost: ratio) {
    try {
      const aspectRatio = await this.prismaService.aspectRatio.findUnique({
        where: { typePost }
      })

      if (!aspectRatio) throw new NotFoundException("aspectRatio not found")

      return aspectRatio
    } catch (error) {
      console.error("An error ocurred while fetching ratio with typePost", typePost, error)
      throw new InternalServerErrorException("An error ocurred while fetching ratio with typePost")
    }
  }
}