import { HarmCategory, HarmBlockThreshold, MediaResolution } from "@google/genai";

export abstract class GenerateImageProviderAbstract {
  abstract createImage(data: {
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
  })
}