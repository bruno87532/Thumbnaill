import { Module } from "@nestjs/common";
import { DescribeThumbnaillController } from "./describe-thumbnaill.controller";
import { DescribeThumbnaillService } from "./describe-thumbnaill.service";
import { AiModule } from "../ai/ai.module";

@Module({
  controllers: [DescribeThumbnaillController],
  providers: [DescribeThumbnaillService],
  exports: [DescribeThumbnaillService],
  imports: [AiModule],
})
export class DescribeThumbnaillModule { }