import { z } from "zod";
import { ConfigEnum } from "@/common/types/config";

export const SettingsSchema = z.object({
  civicIntegrity: z.enum(ConfigEnum),
  dangerousContent: z.enum(ConfigEnum),
  harassmentIntimidation: z.enum(ConfigEnum),
  hateSpeech: z.enum(ConfigEnum),
  sexual: z.enum(ConfigEnum),
})

export type SettingsSchemaType = z.infer<typeof SettingsSchema>