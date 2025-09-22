import { Controller, Request, Res, UseGuards, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Response } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController { 
  constructor (private readonly authService: AuthService) { }

  @Post("login")
  @UseGuards(AuthGuard("local"))
  async login(@Request() req: Request & { user: { id: string } }, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(req, res)
  }
}