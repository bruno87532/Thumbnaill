import { Injectable, Request, Res } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcryptjs"
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.getUserByEmail(email) 
      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user

        return result
      }
      return null 
    } catch {
      return null
    }
  }

    async login(@Request() req: Request & { user: { id: string } }, @Res({ passthrough: true }) res: Response) {
    const allowedFields = ["id"]
    const payload = Object.fromEntries(
      Object.entries(req.user).filter(([key, value]) => value !== undefined && allowedFields.includes(key))
    )
    const token = this.jwtService.sign(payload)
    const nodeEnv = this.configService.get<string>("NODE_ENV")

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: nodeEnv === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    return { success: true }
  }
}