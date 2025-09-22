import { HarmCategory, HarmBlockThreshold } from "@google/genai";

export abstract class GenerateImageProviderAbstract {
  abstract createImage(
    prompt: string,
    categories: { category: HarmCategory, threshold: HarmBlockThreshold }[],
    inlineData: {
      mimeType: "image/png" | "image/jpeg" | "image/webp",
      data: string
    }[]
  )
}