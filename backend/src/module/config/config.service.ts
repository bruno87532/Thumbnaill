import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateConfigDto } from "./dto/update-config.dto";

@Injectable()
export class ConfigService {
  constructor (private readonly prismaService: PrismaService) { }

  async createConfig(idUser: string) {
    try {
      const config = await this.prismaService.config.create({
        data: {
          idUser
        }
      })
      
      return config
    } catch (error) {
      console.error("An error ocurred while creating config with idUser", idUser, error)
      throw new InternalServerErrorException("An error ocurred while creating config with idUser")
    }
  }

  async updateConfigByIdUser(idUser: string, data: UpdateConfigDto) {
    try { 
      const config = await this.prismaService.config.update({
        where: { idUser },
        data
      })

      return config
    } catch (error) {
      console.error("An error ocurred while updating config with idUser", idUser, error)
      throw new InternalServerErrorException("An error ocurred while updating config with idUser")
    }
  }
}