import { Injectable } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai/openai.provider';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { interfaceMessages } from 'src/common/interfaces/ai.interface';
import { ChatPromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class AiService {
  constructor(private readonly providerService: OpenAIProvider) { }

  async chatCompletionWithTemplate(
    templateString: string,
    inputVariables: Record<string, string>,
    options?: {
      model?: "gpt-4o-mini" | "gpt-4o";
      temperature?: number;
    },
    additionalBeforeMessages?: interfaceMessages[],
    additionalAfterMessages?: interfaceMessages[],
  ): Promise<{
    content: string;
  }> {
    const loadedTemplate = ChatPromptTemplate.fromTemplate(templateString)
    const formattedTemplate = await loadedTemplate.format({ ...inputVariables })
    const message: BaseMessage[] = [
      ...await Promise.all((additionalBeforeMessages || []).map(msg => this.toLangChainMessage(msg))),
      await this.toLangChainMessage({ role: "user", content: formattedTemplate }),
      ...await Promise.all((additionalAfterMessages || []).map(msg => this.toLangChainMessage(msg))),
    ];
    return await this.providerService.chatCompletionWithTemplate(
      message,
      options
    );
  }

  async chatCompletionWithImage(
    templateString: string,
    imageUrl: string,
    options?: {
      model: "gpt-4o-mini" | "gpt-4o";
      temperature?: number;
    }
  ): Promise<{
    content: string;
  }> {
    const loadedTemplate = ChatPromptTemplate.fromTemplate(templateString)
    const formattedTemplate = await loadedTemplate.format({ })
    return await this.providerService.chatCompletionWithImage(formattedTemplate, imageUrl, options)
  }

  private async toLangChainMessage(msg: {
    role: "system" | "user" | "assistant",
    content: string
  }) {
    switch (msg.role) {
      case "system":
        return new SystemMessage(msg.content)
      case "user":
        return new HumanMessage(msg.content)
      case "assistant":
        return new AIMessage(msg.content)
    }
  }
}
