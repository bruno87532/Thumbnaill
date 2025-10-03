import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class DescribeImageDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(
    [
      "gpt-4o",
      "gpt-5"
    ]
  )
  model: string
}