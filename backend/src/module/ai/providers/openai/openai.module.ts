import { Module } from "@nestjs/common";
import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from "@nestjs/config";
import { OpenAIProvider } from "./openai.provider";

@Module({
  providers: [
    {
      provide: ChatOpenAI,
      useFactory: (configService: ConfigService) => new ChatOpenAI({
        openAIApiKey: configService.get<string>("OPENAI_API_KEY"),
        modelKwargs: { response_format: { type: "json_object" } }
      }),
      inject: [ConfigService]
    },
    OpenAIProvider
  ],
  exports: [OpenAIProvider]
})
export class OpenAIModule { }