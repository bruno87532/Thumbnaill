import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AIProviderAbstract } from "../../abstract/ai-provider.abstract";
import { ChatOpenAI } from "@langchain/openai";
import { ServiceUnavailableException } from "@nestjs/common";
import { BaseMessage } from "@langchain/core/messages";

@Injectable()
export class OpenAIProvider implements AIProviderAbstract {
  constructor(private readonly llm: ChatOpenAI) { }

  async chatCompletionWithTemplate(
    message: BaseMessage[],
    options?: {
      model?: "gpt-4o-mini" | "gpt-4o";
      temperature?: number;
    }
  ): Promise<{
    content: string;
  }> {
    try {
      const { model = "gpt-4o", temperature = 1 } = options || {}
      this.llm.model = model
      this.llm.temperature = temperature
      const response = await this.llm.invoke(message);

      if (typeof response.content !== "string") throw new BadRequestException("The answer must be a string")
      if (!response.usage_metadata) throw new BadRequestException("usage_metadata is required")

      const { input_tokens, output_tokens } = response.usage_metadata
      return {
        content: response.content,
      }
    } catch (error) {
      throw new ServiceUnavailableException("An error ocurred while generating message with OpenAI", error)
    }
  }

  async chatCompletionWithImage(
    prompt: string,
    imageUrl: string,
    options?: {
      model: "gpt-4o-mini" | "gpt-4o";
      temperature?: number;
    }
  ): Promise<{
    content: string;
  }> {
    try {
      const { model = "gpt-4o", temperature = 0.0 } = options || {};
      this.llm.model = model;
      this.llm.temperature = temperature;
      this.llm.model = "gpt-4o"
      const messages = [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ];
      const response = await this.llm.invoke(messages);
  
      if (typeof response.content !== "string") throw new BadRequestException("The response must be a string");
      if (!response.usage_metadata) throw new BadRequestException("usage_metadata is required");
      return {
        content: response.content,
      };
    } catch (error) {
      console.error("An error ocurred while generating completion with image", error)
      throw new InternalServerErrorException("An error ocurred while generating completion with image")
    }
  }
}