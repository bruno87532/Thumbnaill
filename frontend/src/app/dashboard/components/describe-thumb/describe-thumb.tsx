"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Copy, Check, ImageIcon, Loader2, Zap } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormMessage, FormControl, FormField, FormItem } from "@/components/ui/form"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DescribeThumbnaillService } from "@/services/describe-thumbnaill.service"

const DescribeThumbSchema = z.object({
  file: z.instanceof(File, {
    message: "Por favor, selecione um arquivo de imagem válido.",
  }),
})

type DescribeThumb = z.infer<typeof DescribeThumbSchema>

export const DescribeThumb = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string } | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<DescribeThumb>({
    resolver: zodResolver(DescribeThumbSchema),
    defaultValues: {
      file: undefined,
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

    const { response } = await DescribeThumbnaillService.describeThumbnaill(data.file)
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Analisador de Imagens</h1>
        <p className="text-muted-foreground text-pretty">
          Envie uma thumbnaill e receba um prompt para gerar semelhante
        </p>
      </div>
      <Card className="gradient-card neon-glow-hover">
        <CardHeader>
          <CardTitle className="text-primary">Selecionar Imagem</CardTitle>
          <CardDescription>Faça upload de uma imagem para gerar um prompt descritivo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {})} className="space-y-6">
              <div
                className="relative flex h-40 w-full items-center justify-center rounded-md border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedImages ? (
                  <div className="relative h-full w-full group">
                    <Image
                      src={uploadedImages.preview || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-contain p-2"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute cursor-pointer top-0 right-0 h-6 w-6 rounded-full p-0 transition-opacity z-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadedImages(undefined)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Clique para fazer upload ou arraste as imagens aqui
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG até 10MB cada</p>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            field.onChange(file)
                            handleImageUpload(e)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold neon-glow-hover cursor-pointer"
                disabled={isLoading}
              >
                <Zap className="h-5 w-5 mr-2" />
                {isLoading ? (
                  <>
                    Analisando <Loader2 className="h-6 w-6 animate-spin" />
                  </>
                ) : (
                  "Analisar Imagem"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedPrompt && (
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-primary">Prompt Gerado</CardTitle>
            <CardDescription>Descrição detalhada da imagem analisada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={generatedPrompt}
                readOnly
                className="min-h-[120px] text-base resize-none"
                placeholder="O prompt gerado aparecerá aqui..."
              />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 bg-transparent cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "Copiado!" : "Copiar Prompt"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
