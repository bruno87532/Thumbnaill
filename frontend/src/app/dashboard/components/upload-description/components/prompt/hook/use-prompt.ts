import { AspectRatio } from "../schema/prompt.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PromptSchema } from "../schema/prompt.schema"
import type { PromptSchemaType } from "../schema/prompt.schema"
import { ThumbnaillService } from "@/services/thumbnaill.service"
import React from "react"
import { toast } from "sonner"
import { useThumbnaill } from "@/app/dashboard/context/use-thumbnaill"
import { SubmitHandler, FieldValues } from "react-hook-form"

export const usePrompt = (
  selectedImages: string[],
  improvedPrompt: string,
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>,
  setIsLoadingImprovement: React.Dispatch<React.SetStateAction<boolean>>,
  setIsImprovementClicked: React.Dispatch<React.SetStateAction<boolean>>,
  setImprovedPrompt: React.Dispatch<React.SetStateAction<string>>,
  setShowImprovedPrompt: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoadingSubmit: React.Dispatch<React.SetStateAction<boolean>>,
  setThumbnailUrl: React.Dispatch<React.SetStateAction<string | null>>,
  selectedModel: string,
  setModelError: React.Dispatch<React.SetStateAction<string>>
) => {
  const { setCount, setUrlThumbnaills } = useThumbnaill()

  const form = useForm<PromptSchemaType>({
    resolver: zodResolver(PromptSchema),
    defaultValues: {
      prompt: "",
      aspectRatio: AspectRatio.YOUTUBE,
    },
  })

  const handleImprovePromptClick = () => {
    if (!selectedModel) {
      setModelError("Por favor, selecione um modelo antes de melhorar o prompt")
      return
    }
    setModelError("")
    handleImprovePrompt()
  }

  const optionsAspectRatio = {
    "Youtube (16:9)": AspectRatio.YOUTUBE,
    "Reels e TikTok (9:16)": AspectRatio.INSTAGRAM_TIKTOK,
    "Post do Instagram (1:1)": AspectRatio.INSTAGRAM_POST,
    "Foto do Instagram (4:5)": AspectRatio.INSTAGRAM_PORTRAIT,
    "Cinemático (21:9)": AspectRatio.CINEMATIC,
    "Pinterest (3:4)": AspectRatio.PINTEREST,
  }

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleImprovePrompt = async () => {
    const prompt = form.getValues("prompt")

    if (!prompt.trim()) {
      toast("Erro ao melhorar prompt", {
        description: "Ocorreu um erro ao melhorar prompt, por favor insira um prompt"
      })
      return
    }

    setIsLoadingImprovement(true)
    setIsImprovementClicked(true)
    try {
      const { refinedPrompt } = await ThumbnaillService.improvePrompt({
        ids: selectedImages,
        prompt
      })

      setImprovedPrompt(refinedPrompt)
      setShowImprovedPrompt(true)
    } catch {
      toast("Erro ao melhorar prompt", {
        description: "Ocorreu um erro ao tentar melhorar o prompt. Tente novamente.",
      })
    } finally {
      setIsLoadingImprovement(false)
    }
  }

  const handleSubmit: SubmitHandler<FieldValues> = async (data, e) => {
    if (!e) return
    e.preventDefault()

    setIsLoadingSubmit(true)
    try {
      const nativeEvent = e.nativeEvent as SubmitEvent
      const submitter = nativeEvent.submitter as HTMLButtonElement
      let prompt = data.prompt
      if (submitter.id === "with-improvement") {
        prompt = improvedPrompt
      }
      const result = await ThumbnaillService.createThumbnaill({
        ids: selectedImages,
        prompt,
        aspectRatio: data.aspectRatio,
      })

      if (result && result.data) {
        const uint8 = new Uint8Array(result.data)
        const blob = new Blob([uint8], { type: "image/png" })
        const url = URL.createObjectURL(blob)
        setThumbnailUrl(url)

        setCount((prev) => prev + 1)
        setUrlThumbnaills((prev) => {
          return [
            ...prev,
            {
              id: result.thumbnaill.id,
              url,
            },
          ]
        })
      }
    } catch {
      toast("Ocorreu um erro durante a geração da thumbnaill", {
        description: "Ocorreu um erro inesperado durante o processo de geração. Motivo: Instabilidade na inteligência artificial que gera as imagens.",
        action: {
          label: "Feito",
          onClick: () => null,
        },
      })
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  return {
    form,
    optionsAspectRatio,
    toggleImageSelection,
    handleImprovePrompt,
    handleSubmit,
    handleImprovePromptClick
  }
}