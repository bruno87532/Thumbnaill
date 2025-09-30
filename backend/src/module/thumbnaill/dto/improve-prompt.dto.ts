import { IsString, IsNotEmpty, IsDefined, MinLength, IsArray, ArrayMaxSize } from "class-validator";

export class ImprovePromptDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  prompt: string

  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsDefined({ each: true })
  @IsNotEmpty({ each: true })
  ids: string[]
}