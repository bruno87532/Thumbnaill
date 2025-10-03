"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import { useImage } from "@/app/dashboard/context/use-image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormMessage, Form, FormLabel } from "@/components/ui/form"
import { usePrompt } from "./hook/use-prompt"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const Prompt = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [improvedPrompt, setImprovedPrompt] = useState("")
  const [isLoadingImprovement, setIsLoadingImprovement] = useState(false)
  const [showImprovedPrompt, setShowImprovedPrompt] = useState(false)
  const [isImprovementClicked, setIsImprovementClicked] = useState<boolean>(false)
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [modelError, setModelError] = useState<string>("")

  const { form, handleImprovePrompt, handleSubmit, optionsAspectRatio, toggleImageSelection, handleImprovePromptClick } = usePrompt(
    selectedImages,
    improvedPrompt,
    setSelectedImages,
    setIsLoadingImprovement,
    setIsImprovementClicked,
    setImprovedPrompt,
    setShowImprovedPrompt,
    setIsLoadingSubmit,
    setThumbnailUrl,
    selectedModel,
    setModelError
  )

  const { urlImages } = useImage()

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription className="text-sm">
          Melhoramos o seu Prompt com modelo de inteligência artificial avançado, se optar por esta opção, este processo
          levará alguns segundos.
        </AlertDescription>
      </Alert>

      <Card className="gradient-card neon-glow-hover">
        <CardHeader>
          <CardTitle className="text-primary">Prompt Principal</CardTitle>
          <CardDescription>Descreva detalhadamente a thumbnail que você deseja criar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} id="prompt-form" className="space-y-6">
              <FormField
                control={form.control}
                name="aspectRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proporção da Tela</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a proporção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(optionsAspectRatio).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              <div className="flex items-end gap-3">
                <div className="flex flex-col">
                  <Label htmlFor="model-select" className="mb-2">
                    Modelo de IA (para melhorar prompt)
                  </Label>

                  <Select
                    value={selectedModel}
                    onValueChange={(value) => {
                      setSelectedModel(value)
                      setModelError("")
                    }}
                  >
                    <SelectTrigger id="model-select" className="w-64 h-9">
                      <SelectValue placeholder="Selecione o modelo de IA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-5">
                        Mais detalhado (mais demorado)
                      </SelectItem>
                      <SelectItem value="gpt-4o">
                        Mais objetivo (mais rápido)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImprovePromptClick}
                  disabled={isLoadingImprovement}
                  className="cursor-pointer bg-transparent h-9"
                >
                  {isLoadingImprovement ? "Melhorando Prompt..." : "Melhorar Prompt (Opcional)"}
                </Button>
              </div>

              {modelError && (
                <p className="mt-2 text-sm text-destructive">{modelError}</p>
              )}
            </form>
          </Form>
          {showImprovedPrompt && improvedPrompt && (
            <div className="mt-6 space-y-4">
              <Label className="text-sm font-medium">Prompt Melhorado:</Label>
              <Textarea
                value={improvedPrompt}
                onChange={(e) => setImprovedPrompt(e.target.value)}
                className="min-h-[120px] text-base"
                placeholder="Prompt melhorado aparecerá aqui..."
              />
            </div>
          )}
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
                className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 ${selectedImages.includes(image.id)
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
                className="min-w-[140px] cursor-pointer bg-transparent"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = thumbnailUrl
                  link.download = "thumbnail-gerada.png"
                  link.click()
                }}
              >
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        {showImprovedPrompt && improvedPrompt && (
          <>
            <Button
              disabled={isLoadingSubmit}
              variant="outline"
              className="min-w-[140px] cursor-pointer bg-transparent"
              type="submit"
              form="prompt-form"
              id="without-improvement"
            >
              {isLoadingSubmit ? "Gerando..." : "Gerar sem melhoria"}
            </Button>
            <Button
              type="submit"
              form="prompt-form"
              disabled={isLoadingSubmit}
              className="min-w-[140px] cursor-pointer"
              id="with-improvement"
            >
              {isLoadingSubmit ? "Gerando..." : "Gerar com melhoria"}
            </Button>
          </>
        )}
        {!isImprovementClicked && (
          <Button disabled={isLoadingSubmit} className="min-w-[140px] cursor-pointer" type="submit" form="prompt-form">
            {isLoadingSubmit ? "Gerando..." : "Gerar Thumbnail"}
          </Button>
        )}
      </div>
    </div>
  )
}
