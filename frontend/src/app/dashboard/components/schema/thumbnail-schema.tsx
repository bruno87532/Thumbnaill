import { z } from "zod"

export const ImageSchema = z.object({
  files: z
    .array(
      z.instanceof(File, { message: "A imagem não pode estar vazia" })
        .refine((file) => file.type.startsWith("image/"), { message: "O arquivo deve ser uma imagem." })
    ),
})

export type ImageSchemaType = z.infer<typeof ImageSchema>