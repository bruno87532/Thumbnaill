import { IsString } from "class-validator";

export class CreateDrawDto {
  @IsString()
  key: string
}