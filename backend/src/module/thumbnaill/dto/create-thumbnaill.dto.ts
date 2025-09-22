import { IsString, IsNotEmpty, IsArray, ArrayMaxSize, IsDefined, MinLength } from "class-validator";

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
}