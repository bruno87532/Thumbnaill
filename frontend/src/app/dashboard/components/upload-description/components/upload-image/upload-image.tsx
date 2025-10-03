"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card"
import { Upload, ImageIcon, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FormField, Form, FormMessage, FormControl, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUploadImage } from "./hook/use-upload-image"

export const UploadImage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { form, handleSubmit, handleImageUpload, removeImage } = useUploadImage(setIsLoading, setUploadedImages)

  return (
    <>
      <Alert>
        <AlertDescription className="text-sm">
          Ao fazer upload de suas imagens, utilizamos inteligência artificial para processar detalhes de sua imagem. Este processo pode demorar alguns segundos.
        </AlertDescription>
      </Alert>

      <Card className="gradient-card neon-glow-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload de Imagens
          </CardTitle>
          <CardDescription>Envie múltiplas imagens para usar como referência (opcional)</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div
                className="relative flex h-40 w-full items-center justify-center rounded-md border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Clique para fazer upload ou arraste as imagens aqui
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG até 10MB cada</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        multiple={true}
                        ref={(el) => {
                          fileInputRef.current = el
                          field.ref(el)
                        }}
                        onChange={(e) => {
                          const files = e.target.files ? Array.from(e.target.files) : []
                          field.onChange([...form.getValues("files"), ...files])
                          handleImageUpload(e)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {uploadedImages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Imagens Enviadas ({uploadedImages.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((imageData, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                          <Image
                            src={imageData.preview}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute cursor-pointer -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{imageData.file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold neon-glow-hover cursor-pointer"
                disabled={uploadedImages.length === 0 || isLoading}
              >
                <Zap className="h-5 w-5 mr-2" />
                {isLoading ? (
                  <>Salvando <Loader2 className="h-6 w-6 animate-spin" /></>
                ) : (
                  <>Salvar Imagem ({uploadedImages.length} {uploadedImages.length === 1 ? "imagem" : "imagens"})</>
                )}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
