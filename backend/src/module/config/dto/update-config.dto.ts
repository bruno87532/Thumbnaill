import { config } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator"
import { Type } from "class-transformer";

export class UpdateConfigDto {
  @IsEnum(config)
  @Type(() => String)
  civicIntegrity: config;

  @IsEnum(config)
  @Type(() => String)
  dangerousContent: config;

  @IsEnum(config)
  @Type(() => String)
  harassmentIntimidation: config;

  @IsEnum(config)
  @Type(() => String)
  hateSpeech: config;

  @IsEnum(config)
  @Type(() => String)
  sexual: config;
}