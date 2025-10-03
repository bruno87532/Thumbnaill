import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { DescribeThumbnaillService } from "./describe-thumbnaill.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";
import { DescribeImageDto } from "./dto/describe-image.dto";

@Controller("describe-thumbnaill")
export class DescribeThumbnaillController {
  constructor(private readonly describeImageService: DescribeThumbnaillService) { }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("image", {
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp/
      const isValid = allowed.test(file.mimetype)
      if (isValid) cb(null, true)
      else cb(new Error("Only images jpeg, jpg, png and webp are allowed"), false)
    }
  }))
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async describeImage(
    @UploadedFile() image: Express.Multer.File,
    @Body() data: DescribeImageDto
  ) {
    return await this.describeImageService.describeImage(image, data)
  }
}