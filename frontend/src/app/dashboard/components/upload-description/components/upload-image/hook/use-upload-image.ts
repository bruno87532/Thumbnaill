import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageSchema, type ImageSchemaType } from "../schema/thumbnail-schema"
import { ImageService } from "@/services/image.service"
import { toast } from "sonner"
import { useImage } from "@/app/dashboard/context/use-image"

export const useUploadImage = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadedImages: React.Dispatch<React.SetStateAction<{ file: File, preview: string }[]>>
) => {
  const { setUrlImages } = useImage()

  const form = useForm({
    resolver: zodResolver(ImageSchema),
    defaultValues: {
      files: [],
    },
  })

  const handleSubmit = async (data: ImageSchemaType) => {
    try {
      setIsLoading(true)
      const response = await ImageService.createImage(data.files)
      setUrlImages((prev) => {
        return [
          ...response.imagesFile.map((image, index) => {
            const uint8 = new Uint8Array(image.buffer.data)
            const blob = new Blob([uint8], { type: image.buffer.ContentType })
            const url = URL.createObjectURL(blob)
            return {
              url,
              id: response.images[index].id
            }
          }),
          ...prev
        ]
      })
      toast("Imagens salvas", {
        description: "Imagens salvas com sucesso",
        action: {
          label: "Feito",
          onClick: () => null,
        },
      })
      form.setValue("files", [])
      setUploadedImages((prev) => {
        prev.map((image) => URL.revokeObjectURL(image.preview))
        return []
      })
    } catch (error) {
      toast("Ocorreu um erro durante a geração da thumbnaill", {
        description: "Ocorreu um erro inesperado durante o processo de geração. Por favor tente novamente mais tarde.",
        action: {
          label: "Feito",
          onClick: () => null,
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: { file: File; preview: string }[] = []

    for (const file of Array.from(files)) {
      const preview = URL.createObjectURL(file)
      newImages.push({ file, preview })
    }

    setUploadedImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })

    const currentFiles = form.getValues("files")
    const newFiles = currentFiles.filter((_, i) => i !== index)
    form.setValue("files", newFiles)
  }

  return { form, handleSubmit, handleImageUpload, removeImage }
}