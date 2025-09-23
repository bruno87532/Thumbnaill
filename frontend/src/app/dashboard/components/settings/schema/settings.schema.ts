import { z } from "zod"
import { ConfigEnum, QualityMode } from "@/common/types/config"

export const SettingsSchema = z.object({
  civicIntegrity: z.enum(ConfigEnum),
  dangerousContent: z.enum(ConfigEnum),
  harassmentIntimidation: z.enum(ConfigEnum),
  hateSpeech: z.enum(ConfigEnum),
  sexual: z.enum(ConfigEnum),
  qualityMode: z.enum(QualityMode),
})

export type SettingsSchemaType = z.infer<typeof SettingsSchema>
