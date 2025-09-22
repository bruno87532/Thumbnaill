import { Injectable } from "@nestjs/common";
import { GenaiProvider } from "./provider/genai/genai.provider";
import { HarmCategory, HarmBlockThreshold } from "@google/genai";

@Injectable()
export class GenerateImageService {
  constructor(private readonly generateImageProvider: GenaiProvider) { }

  async createImage(
    prompt: string,
    categories: {
      category: HarmCategory,
      threshold: HarmBlockThreshold
    }[],
    inlineData: {
      mimeType: "image/png" | "image/jpeg" | "image/webp",
      data: string
    }[]
  ) {
    return await this.generateImageProvider.createImage(prompt, categories, inlineData)
  }
}