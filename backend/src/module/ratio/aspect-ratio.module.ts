import { Module } from "@nestjs/common";
import { AspectRatioService } from "./aspect-ratio.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [AspectRatioService],
  exports: [AspectRatioService],
})
export class AspectRatioModule { }