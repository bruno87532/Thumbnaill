import { z } from "zod"

export const DescribeThumbSchema = z.object({
  file: z
    .instanceof(File, { message: "A imagem não pode estar vazia" })
    .refine((file) => file.type.startsWith("image/"), { message: "O arquivo deve ser uma imagem." })
})

export type DescribeThumb = z.infer<typeof DescribeThumbSchema>