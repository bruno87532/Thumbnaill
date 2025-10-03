import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AIProviderAbstract } from "../../abstract/ai-provider.abstract";
import { ServiceUnavailableException } from "@nestjs/common";
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "openai/resources/index.js";
import { Models } from "src/common/types/models";

@Injectable()
export class OpenAIProvider implements AIProviderAbstract {
  constructor(
    private readonly openAi: OpenAI,
  ) { }

  async chatCompletionWithTemplate(
    systemPrompt: string,
    userPrompt?: string | undefined,
    options?: {
      model?: "gpt-5";
      temperature?: number;
    }
  ): Promise<{
    content: string;
  }> {
    try {
      const { model = "gpt-5", temperature = 1 } = options || {}

      const response = await this.openAi.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          } as ChatCompletionMessageParam,
          ...(userPrompt ?
            [
              {
                role: "user",
                content: userPrompt
              } as ChatCompletionMessageParam
            ] :
            []
          ),
        ]
      })

      const content = response.choices[0]?.message?.content 
      if (!content) throw new BadRequestException("Response is required")

      return {
        content
      }

    } catch (error) {
      throw new ServiceUnavailableException("An error ocurred while generating message with OpenAI", error)
    }
  }

  async chatCompletionWithImage(
    prompt: string,
    imageUrl: string,
    options?: {
      model: Models;
      temperature?: number;
    }
  ): Promise<{
    content: string;
  }> {
    try {
      const { model = "gpt-5", temperature = 1 } = options || {};
      const response = await this.openAi.chat.completions.create({
        model: model,
        temperature,
        messages: [
          {
            role: "system",
            content: prompt
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image" },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ]
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new BadRequestException("Response is required")
      return {
        content
      }
    } catch (error) {
      console.error("An error ocurred while generating completion with image", error)
      throw new InternalServerErrorException("An error ocurred while generating completion with image")
    }
  }
}