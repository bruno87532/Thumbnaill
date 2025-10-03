import { DescribeThumbnaillService } from "@/services/describe-thumbnaill.service"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DescribeThumb, DescribeThumbSchema } from "../schema/descibre-thumb.schema"
import { toast } from "sonner"

export const useDescribeThumb = (
  setUploadedImages: React.Dispatch<React.SetStateAction<{ file: File, preview: string } | undefined>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setGeneratedPrompt: React.Dispatch<React.SetStateAction<string>>,
  setCopied: React.Dispatch<React.SetStateAction<boolean>>,
  generatedPrompt: string
) => {
  const form = useForm<DescribeThumb>({
    resolver: zodResolver(DescribeThumbSchema),
    defaultValues: {
      file: undefined,
      model: ""
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    form.setValue("file", file)

    const preview = URL.createObjectURL(file)
    setUploadedImages({
      file,
      preview,
    })
  }

  const handleSubmit = async (data: DescribeThumb) => {
    setIsLoading(true)

    const { response } = await DescribeThumbnaillService.describeThumbnaill(data.file, data.model)
    setGeneratedPrompt(response)
    setIsLoading(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      toast("Prompt copiado!", {
        description: "O prompt foi copiado para a área de transferência.",
        action: {
          label: "Feito",
          onClick: () => null,
        },
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast("Erro ao copiar", {
        description: "Não foi possível copiar o prompt.",
        action: {
          label: "Feito",
          onClick: () => null,
        },
      })
    }
  }

  return { form, handleImageUpload, handleSubmit, copyToClipboard }
}