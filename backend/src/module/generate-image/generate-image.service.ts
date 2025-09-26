import { Injectable } from "@nestjs/common";
import { GenaiProvider } from "./provider/genai/genai.provider";
import { HarmCategory, HarmBlockThreshold, MediaResolution } from "@google/genai";

@Injectable()
export class GenerateImageService {
  constructor(private readonly generateImageProvider: GenaiProvider) { }

  async createImage(data: {
    prompt: string,
    aspectRatioText: string,
    categories: {
      category: HarmCategory,
      threshold: HarmBlockThreshold
    }[],
    inlineData: {
      mimeType: "image/png" | "image/jpeg" | "image/webp",
      data: string
    }[],
    mediaResolution: MediaResolution,
    promptText?: string,
  }) {
    return await this.generateImageProvider.createImage(data)
  }
}