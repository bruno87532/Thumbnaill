"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import { useImage } from "../../context/use-image"
import { SettingsSchema, type SettingsSchemaType } from "./schema/settings.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormMessage, Form } from "@/components/ui/form"
import { ThumbnaillService } from "@/services/thumbnaill.service"
import { Loader2 } from "lucide-react"

export const Prompt = () => {
  const form = useForm<SettingsSchemaType>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      prompt: "",
    },
  })

  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generatedThumbnail, setGeneratedThumbnail] = useState<Uint8Array | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const { urlImages } = useImage()

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleSubmit = async (data: SettingsSchemaType) => {
    setIsLoading(true)
    try {
      const result = await ThumbnaillService.createThumbnaill({
        ids: selectedImages,
        prompt: data.prompt,
      })

      if (result && result.data) {
        const uint8 = new Uint8Array(result.data)
        setGeneratedThumbnail(uint8)
        // Convert buffer to blob URL for display
        const blob = new Blob([uint8], { type: "image/png" })
        const url = URL.createObjectURL(blob)
        setThumbnailUrl(url)
      }
    } catch (error) {
      console.error("Erro ao gerar thumbnail:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="gradient-card neon-glow-hover">
        <CardHeader>
          <CardTitle className="text-primary">Prompt Principal</CardTitle>
          <CardDescription>Descreva detalhadamente a thumbnail que você deseja criar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} id="prompt-form">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Crie uma thumbnail épica para vídeo de gaming com um personagem em ação, efeitos de fogo, texto 'ÉPICO' em destaque, cores vibrantes azul e laranja..."
                        className="min-h-[120px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Seletor de Imagens</CardTitle>
          <CardDescription>Escolha as imagens de referência para sua thumbnail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {urlImages.map((image) => (
              <div
                key={image.id}
                className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  selectedImages.includes(image.id)
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => toggleImageSelection(image.id)}
              >
                <div className="aspect-square overflow-hidden rounded-md">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt="Imagem salva"
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedImages.includes(image.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedImages.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <Label className="text-sm font-medium">{selectedImages.length} imagem(ns) selecionada(s)</Label>
            </div>
          )}
        </CardContent>
      </Card>

      {thumbnailUrl && (
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-primary">Thumbnail Gerada</CardTitle>
            <CardDescription>Sua thumbnail foi gerada com sucesso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="relative max-w-md w-full">
                <img
                  src={thumbnailUrl || "/placeholder.svg"}
                  alt="Thumbnail gerada"
                  className="w-full h-auto rounded-lg border-2 border-primary/20 shadow-lg"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = thumbnailUrl
                  link.download = "thumbnail-gerada.png cursor-pointer"
                  link.click()
                }}
              >
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          disabled={isLoading}
          className="min-w-[140px] cursor-pointer"
          type="submit"
          form="prompt-form"
        >
          {isLoading ? "Gerando..." : "Gerar Thumbnail"}
        </Button>
      </div>
    </div>
  )
}
