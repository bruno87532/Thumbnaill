import { ConfigService } from "@nestjs/config"
import * as path from "path"
import * as fs from "fs"
import { v4 as uuid } from "uuid"

export async function saveImage(configService: ConfigService, file: Express.Multer.File) {
  const server = configService.get<string>("SERVER_IMG")

  const uploadPath = path.join(process.cwd(), "./images")
  const fileName = `${new Date().getTime()}-${uuid()}.png`
  const filePath = path.join(uploadPath, fileName)
  
  await fs.promises.mkdir(uploadPath, { recursive: true })
  await fs.promises.writeFile(filePath, file.buffer)

  const urlImage = `${server}/images/${fileName}`
  return urlImage
}