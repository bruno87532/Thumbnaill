"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import { useImage } from "../../context/use-image"

export const Prompt = () => {
  const [prompt, setPrompt] = useState("")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { urlImages } = useImage()

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card className="gradient-card neon-glow-hover">
        <CardHeader>
          <CardTitle className="text-primary">Prompt Principal</CardTitle>
          <CardDescription>Descreva detalhadamente a thumbnail que você deseja criar</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Crie uma thumbnail épica para vídeo de gaming com um personagem em ação, efeitos de fogo, texto 'ÉPICO' em destaque, cores vibrantes azul e laranja..."
            className="min-h-[120px] text-base"
          />
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
                  <img src={image.url || "/placeholder.svg"} alt="Imagem salva" className="w-full h-full object-cover" />
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

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!prompt.trim() || isLoading} className="min-w-[140px]">
          {isLoading ? "Enviando..." : "Enviar Requisição"}
        </Button>
      </div>
    </div>
  )
}
