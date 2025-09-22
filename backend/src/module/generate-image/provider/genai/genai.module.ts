import { Module } from "@nestjs/common";
import { GenaiProvider } from "./genai.provider";
import { ConfigService } from "@nestjs/config";
import { GoogleGenAI } from "@google/genai";

@Module({
  providers: [
    GenaiProvider,
    {
      provide: "GOOGLE_CLIENT",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const project = configService.get<string>("GOOGLE_CLOUD_PROJECT")
        const location = configService.get<string>("GOOGLE_CLOUD_LOCATION")
        const vertexai = configService.get<string>("GOOGLE_GENAI_USE_VERTEXAI") === "True"

        const ai = new GoogleGenAI({
          vertexai,
          project,
          location
        })

        return ai
      }
    }
  ],
  exports: [GoogleGenAI]
})
export class GenaiModule { }