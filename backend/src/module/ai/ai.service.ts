import { Injectable } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai/openai.provider';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { interfaceMessages } from 'src/common/interfaces/ai.interface';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Models } from 'src/common/types/models';

@Injectable()
export class AiService {
  constructor(private readonly providerService: OpenAIProvider) { }

  async chatCompletionWithTemplate(
    systemPrompt: string,
    userPrompt?: string | undefined,
    options?: {
      model?: "gpt-5";
      temperature?: number;
    },
  ): Promise<{
    content: string;
  }> {
    return await this.providerService.chatCompletionWithTemplate(systemPrompt, userPrompt, options)
  }

  async chatCompletionWithImage(
    templateString: string,
    imageUrl: string,
    options?: {
      model: Models;
      temperature?: number;
    }
  ): Promise<{
    content: string;
  }> {
    return await this.providerService.chatCompletionWithImage(templateString, imageUrl, options)
  }
}
