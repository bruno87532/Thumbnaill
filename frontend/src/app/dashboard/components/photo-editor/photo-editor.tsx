"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, ImageIcon, Layers, Zap } from "lucide-react"
import { LayerItem } from "./components/layer-item/layer-item"
import { Canvas } from "./components/canvas/canvas"
import type { Layer } from "@/common/types/layer"
import { UsePhotoEditor } from "./hook/use-photo-editor"

export const PhotoEditor = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)
  const layerInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 })

  const {
    deleteLayer,
    exportImage,
    handleBackgroundUpload,
    handleLayerUpload,
    moveLayerDown,
    moveLayerUp,
    updateLayer
  } = UsePhotoEditor(
    setBackgroundImage,
    backgroundImage,
    setSelectedLayerId,
    selectedLayerId,
    setLayers,
    layers,
    layerInputRef,
    canvasDimensions,
    setCanvasDimensions
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Editor de Fotos</h1>
          <p className="text-muted-foreground text-pretty">
            Crie composições incríveis com múltiplas camadas e exporte em alta qualidade
          </p>
        </div>

        <Card className="gradient-card neon-glow-hover">
          <CardHeader>
            <CardTitle className="text-primary">Imagem de Fundo</CardTitle>
            <CardDescription>Faça upload da imagem principal que servirá como fundo da composição</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="relative flex h-40 w-full items-center justify-center rounded-md border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => backgroundInputRef.current?.click()}
            >
              {backgroundImage ? (
                <div className="relative h-full w-full">
                  <img
                    src={backgroundImage || "/placeholder.svg"}
                    alt="Background preview"
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Clique para fazer upload ou arraste a imagem aqui
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG até 10MB</p>
                </div>
              )}
            </div>
            <Input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBackgroundUpload}
            />
          </CardContent>
        </Card>

        <Card className="gradient-card neon-glow-hover">
          <CardHeader>
            <CardTitle className="text-primary">Adicionar Camadas</CardTitle>
            <CardDescription>
              Faça upload de imagens adicionais para sobrepor ao fundo (você pode selecionar múltiplas)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="relative flex h-32 w-full items-center justify-center rounded-md border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => layerInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <Layers className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Clique para adicionar camadas</p>
                <p className="text-xs text-muted-foreground mt-1">Múltiplas imagens podem ser selecionadas</p>
              </div>
            </div>
            <Input
              ref={layerInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleLayerUpload}
            />
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-primary">Visualização da Composição</CardTitle>
            <CardDescription>
              Arraste as camadas para reposicionar, use os controles para redimensionar e rotacionar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-center bg-muted/30 rounded-lg p-8 overflow-auto max-h-[800px]">
              <Canvas
                ref={canvasRef}
                backgroundImage={backgroundImage}
                layers={layers}
                selectedLayerId={selectedLayerId}
                onSelectLayer={setSelectedLayerId}
                onUpdateLayer={updateLayer}
                canvasDimensions={canvasDimensions}
              />
            </div>
          </CardContent>
        </Card>

        {layers.length > 0 && (
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-primary">Gerenciar Camadas ({layers.length})</CardTitle>
              <CardDescription>Organize, ajuste e remova suas camadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {[...layers].reverse().map((layer, index) => (
                    <LayerItem
                      key={layer.id}
                      layer={layer}
                      isSelected={selectedLayerId === layer.id}
                      onSelect={() => setSelectedLayerId(layer.id)}
                      onDelete={() => deleteLayer(layer.id)}
                      onMoveUp={() => moveLayerUp(layer.id)}
                      onMoveDown={() => moveLayerDown(layer.id)}
                      canMoveUp={index > 0}
                      canMoveDown={index < layers.length - 1}
                      onUpdate={(updates) => updateLayer(layer.id, updates)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        <Card className="gradient-card neon-glow-hover">
          <CardHeader>
            <CardTitle className="text-primary">Exportar Composição</CardTitle>
            <CardDescription>Baixe sua composição final em formato PNG ou JPEG</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              size="lg"
              className="w-full gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold neon-glow-hover cursor-pointer"
              onClick={() => exportImage("png")}
              disabled={!backgroundImage && layers.length === 0}
            >
              <Zap className="h-5 w-5 mr-2" />
              Exportar como PNG
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full px-8 py-6 text-lg font-semibold cursor-pointer bg-transparent"
              onClick={() => exportImage("jpeg")}
              disabled={!backgroundImage && layers.length === 0}
            >
              <Download className="h-5 w-5 mr-2" />
              Exportar como JPEG
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
