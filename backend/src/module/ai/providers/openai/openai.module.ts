import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OpenAIProvider } from "./openai.provider";
import OpenAI from "openai"

@Module({
  providers: [
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        const openai = new OpenAI({
          apiKey: configService.get<string>("OPENAI_API_KEY")
        })

        return openai
      },
      inject: [ConfigService]
    },
    OpenAIProvider
  ],
  exports: [OpenAIProvider]
})
export class OpenAIModule { }