import { HarmCategory } from "@google/genai";

export function mapToHarmCategory(category: string): HarmCategory {
  const mapping: Record<string, HarmCategory> = {
    harassmentIntimidation: HarmCategory.HARM_CATEGORY_HARASSMENT,
    harassment: HarmCategory.HARM_CATEGORY_HARASSMENT,

    hateSpeech: HarmCategory.HARM_CATEGORY_HATE_SPEECH,

    sexual: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    sexuallyExplicit: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,

    dangerousContent: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,

    civicIntegrity: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
  };

  const normalized = category.trim();
  const mapped = mapping[normalized];

  if (!mapped) {
    throw new Error(`Categoria inválida ou não suportada: ${category}`);
  }

  return mapped;
}
