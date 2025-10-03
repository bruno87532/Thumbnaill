import { z } from "zod"

export const DescribeThumbSchema = z.object({
  file: z
    .instanceof(File, { message: "A imagem não pode estar vazia" })
    .refine((file) => file.type.startsWith("image/"), { message: "O arquivo deve ser uma imagem." }),
  model: z
    .string()
    .min(1, "Por favor, selecione um tipo de análise."),
})

export type DescribeThumb = z.infer<typeof DescribeThumbSchema>
