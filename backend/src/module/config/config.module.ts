import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ConfigService } from "./config.service";
import { ConfigController } from "./config.controller";

@Module({
  controllers: [ConfigController],
  imports: [PrismaModule],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule { }