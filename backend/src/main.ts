import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from "cookie-parser";
import { join } from "path";
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(cookieParser())
  
  app.useStaticAssets(join(process.cwd(), "images"), {
    prefix: "/images"
  })
  
  const configService = app.get(ConfigService)
  const allowedOrigin = configService.get<string>("ALLOWED_ORIGIN") ?? ""
  app.enableCors({
    origin: [allowedOrigin],
    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    allowedHeaders: "Content-Type",
    credentials: true
  })

  const port = parseInt(configService.get<string>("PORT") ?? "3000")
  await app.listen(port);
}
bootstrap();
