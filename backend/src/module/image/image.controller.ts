import { Controller, Post, UploadedFiles, UseInterceptors, Request, UseGuards, Get, Delete, Param } from "@nestjs/common";
import { ImageService } from "./image.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";

@Controller("image")
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FilesInterceptor("images", 10, {
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp/
      const isValid = allowed.test(file.mimetype)
      if (isValid) cb(null, true)
      else cb(new Error("Only images jpeg, jpg, png and webp are allowed"), false)
    }
  }))
  async createImage(
    @UploadedFiles() images: Express.Multer.File[],
    @Request() req,
  ) {
    return await this.imageService.createImage(req.user.id, images) 
  }

  @Get("/idUser")
  @UseGuards(AuthGuard("jwt"))
  async getImagesByIdUser(@Request() req) {
    return await this.imageService.getImagesByIdUser(req.user.id)
  }

  @Delete("/:id")
  @UseGuards(AuthGuard("jwt"))
  async deleteImageById(@Request() req, @Param("id") id: string) {
    return await this.imageService.deleteImageById(req.user.id, id)
  }
}