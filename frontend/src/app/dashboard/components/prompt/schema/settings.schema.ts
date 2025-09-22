import { z } from "zod";
import { ConfigEnum } from "@/common/types/config";

export const SettingsSchema = z.object({
  prompt: z.string().min(1, "O prompt é obrigatório")
})

export type SettingsSchemaType = z.infer<typeof SettingsSchema>