import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  async getUserByEmail(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email }
      })

      if (!user) throw new NotFoundException("User not found")

      return user
    } catch (error) {
      if (error instanceof HttpException) throw error
      console.error("An error ocurred while fetching user with email", email, error)
      throw new InternalServerErrorException("An error ocurred while fetching user with email")
    }
  }
}