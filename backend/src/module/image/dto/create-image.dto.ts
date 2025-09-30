import { Transform } from "class-transformer";
import { IsBoolean } from "class-validator";

export class CreateImageDto {
  @Transform(({ value }) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true"
    return false
  })
  @IsBoolean()
  removeBackground: boolean
}