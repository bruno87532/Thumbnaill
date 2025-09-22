import { Module } from '@nestjs/common';
import { ThumbnaillModule } from './module/thumbnaill/thumbnaill.module';
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { GenerateImageModule } from './module/generate-image/generate-image.module';
import { ImageModule } from './module/image/image.module';
import { ConfigModule as ConfigModuleDb } from './module/config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    ThumbnaillModule,
    AuthModule,
    ImageModule,
    UserModule,
    GenerateImageModule,
    ConfigModuleDb
  ],
})
export class AppModule {}
