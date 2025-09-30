import { z } from "zod";

export enum AspectRatio {
  YOUTUBE = "YOUTUBE",
  INSTAGRAM_TIKTOK = "INSTAGRAM_TIKTOK",
  INSTAGRAM_POST = "INSTAGRAM_POST",
  INSTAGRAM_PORTRAIT = "INSTAGRAM_PORTRAIT",
  CINEMATIC = "CINEMATIC",
  PINTEREST = "PINTEREST",
  PINTEREST_TALL = "PINTEREST_TALL"
}

export const PromptSchema = z.object({
  prompt: z.string().min(1, "O prompt é obrigatório"),
  aspectRatio: z.enum(AspectRatio),
})

export type PromptSchemaType = z.infer<typeof PromptSchema>