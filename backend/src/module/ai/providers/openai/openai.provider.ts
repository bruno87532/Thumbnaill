import { BadRequestException, Injectable } from "@nestjs/common";
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
    cost: number;
  }> {
    try {
      const { model = "gpt-4o", temperature = 1 } = options || {}
      this.llm.model = model
      this.llm.temperature = temperature
      const response = await this.llm.invoke(message);

      if (typeof response.content !== "string") throw new BadRequestException("The answer must be a string")
      if (!response.usage_metadata) throw new BadRequestException("usage_metadata is required")

      const { input_tokens, output_tokens } = response.usage_metadata
      const cost = this.calculateCosts(model, input_tokens, output_tokens)
      return {
        content: response.content,
        cost
      }
    } catch (error) {
      throw new ServiceUnavailableException("An error ocurred while generating message with OpenAI", error)
    }
  }

  private calculateCosts(
    model: "gpt-4o-mini" | "gpt-4o",
    inputTokens: number,
    outputTokens: number,
  ) {
    const expenses = {
      "gpt-4o-mini": {
        input: 0.15,
        output: 0.60
      },
      "gpt-4o": {
        input: 2.50,
        output: 10
      },
    }

    const price = expenses[model]
    const inputCost = (price.input * inputTokens) / 1000000
    const outputCost = (price.output * outputTokens) / 1000000
    const cost = parseFloat((inputCost + outputCost).toFixed(10))
    return cost
  }
}