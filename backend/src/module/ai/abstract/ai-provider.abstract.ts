import { Models } from "src/common/types/models";

export abstract class AIProviderAbstract {
  abstract chatCompletionWithTemplate(
    systemPrompt: string,
    userPrompt?: string,
    options?: {
      model?: Models,
      temperature?: number;
    }
  ): Promise<{
    content: string;
  }>

  abstract chatCompletionWithImage(
    prompt: string,
    imageUrl: string,
    options?: {
      model: "gpt-5";
      temperature?: number;
    }
  ): Promise<{
    content: string
  }>
}