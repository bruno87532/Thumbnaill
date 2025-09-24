import { IsString, IsNotEmpty, IsArray, ArrayMaxSize, IsDefined, MinLength, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { ratio } from "@prisma/client";

export class CreateThumbnaillDto {
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsDefined({ each: true })
  @IsNotEmpty({ each: true })
  ids: string[]

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  prompt: string

  @IsEnum(ratio)
  @Type(() => String)
  aspectRatio: ratio;
}