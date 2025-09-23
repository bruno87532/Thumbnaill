import type { BaseMessage, MessageContent } from "@langchain/core/messages";

export abstract class AIProviderAbstract {
  abstract chatCompletionWithTemplate(
    message: BaseMessage[],
    options?: {
      model?: "gpt-4o-mini" | "gpt-4o";
      temperature?: number;
    }
  ): Promise<{
    content: string;
  }>

  abstract chatCompletionWithImage(
    prompt: string,
    imageUrl: string,
    options?: {
      model: "gpt-4o-mini" | "gpt-4o";
      temperature?: number;
    }
  ): Promise<{
    content: string
  }>
}