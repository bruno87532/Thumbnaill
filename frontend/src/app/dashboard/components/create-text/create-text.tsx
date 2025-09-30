"use client"

import type React from "react"
import { useCreateText } from "./hook/use-create-text"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Download, Plus, Trash2, Bold, Italic, Underline, Strikethrough, Type } from "lucide-react"

export const CreateText = () => {
  const {
    addTextLine,
    fonts,
    handleDownload,
    removeTextLine,
    textLines,
    updateTextLine,
    canvasRef
  } = useCreateText()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Type className="h-6 w-6" />
              Editor de Texto para Imagem
            </CardTitle>
            <CardDescription>
              Crie textos personalizados com múltiplas linhas e baixe como imagem PNG com fundo transparente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {textLines.map((line, index) => (
              <Card key={line.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Linha {index + 1}</Label>
                      {textLines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTextLine(line.id)}
                          className="h-8 text-destructive hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`text-${line.id}`}>Texto</Label>
                      <Input
                        id={`text-${line.id}`}
                        type="text"
                        placeholder="Digite seu texto aqui..."
                        value={line.text}
                        onChange={(e) => updateTextLine(line.id, "text", e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`font-${line.id}`}>Fonte</Label>
                        <Select
                          value={line.fontFamily}
                          onValueChange={(value) => updateTextLine(line.id, "fontFamily", value)}
                        >
                          <SelectTrigger id={`font-${line.id}`}>
                            <SelectValue placeholder="Selecione a fonte" />
                          </SelectTrigger>
                          <SelectContent>
                            {fonts.map((font) => (
                              <SelectItem
                                key={font.value}
                                value={font.value}
                                onMouseEnter={
                                  () => {
                                    updateTextLine(line.id, "oldFontFamily", font.value)
                                  }
                                }
                                onMouseLeave={
                                  () => {
                                    updateTextLine(line.id, "oldFontFamily", null)
                                  }
                                }
                              >
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`color-${line.id}`}>Cor do Texto</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`color-${line.id}`}
                            type="color"
                            value={line.color}
                            onChange={(e) => updateTextLine(line.id, "color", e.target.value)}
                            className="h-10 w-20 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={line.color}
                            onChange={(e) => updateTextLine(line.id, "color", e.target.value)}
                            className="flex-1"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`size-${line.id}`}>Tamanho: {line.fontSize}px</Label>
                        <Slider
                          id={`size-${line.id}`}
                          min={16}
                          max={120}
                          step={1}
                          value={[line.fontSize]}
                          onValueChange={(value) => updateTextLine(line.id, "fontSize", value[0])}
                          className="pt-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`weight-${line.id}`}>Espessura: {line.fontWeight}</Label>
                        <Slider
                          id={`weight-${line.id}`}
                          min={100}
                          max={900}
                          step={100}
                          value={[line.fontWeight]}
                          onValueChange={(value) => updateTextLine(line.id, "fontWeight", value[0])}
                          className="pt-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`opacity-${line.id}`}>Opacidade: {line.opacity}%</Label>
                        <Slider
                          id={`opacity-${line.id}`}
                          min={0}
                          max={100}
                          step={1}
                          value={[line.opacity]}
                          onValueChange={(value) => updateTextLine(line.id, "opacity", value[0])}
                          className="pt-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Estilos de Texto</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={line.bold ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTextLine(line.id, "bold", !line.bold)}
                          className="gap-2 cursor-pointer"
                        >
                          <Bold className="h-4 w-4" />
                          Negrito
                        </Button>
                        <Button
                          variant={line.italic ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTextLine(line.id, "italic", !line.italic)}
                          className="gap-2 cursor-pointer"
                        >
                          <Italic className="h-4 w-4" />
                          Itálico
                        </Button>
                        <Button
                          variant={line.underline ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTextLine(line.id, "underline", !line.underline)}
                          className="gap-2 cursor-pointer"
                        >
                          <Underline className="h-4 w-4" />
                          Sublinhado
                        </Button>
                        <Button
                          variant={line.strikethrough ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTextLine(line.id, "strikethrough", !line.strikethrough)}
                          className="gap-2 cursor-pointer"
                        >
                          <Strikethrough className="h-4 w-4" />
                          Tracejado
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                      <Label className="text-base font-semibold">Sombra</Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`shadow-x-${line.id}`}>Deslocamento X: {line.shadowOffsetX}px</Label>
                          <Slider
                            id={`shadow-x-${line.id}`}
                            min={-50}
                            max={50}
                            step={1}
                            value={[line.shadowOffsetX]}
                            onValueChange={(value) => updateTextLine(line.id, "shadowOffsetX", value[0])}
                            className="pt-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`shadow-y-${line.id}`}>Deslocamento Y: {line.shadowOffsetY}px</Label>
                          <Slider
                            id={`shadow-y-${line.id}`}
                            min={-50}
                            max={50}
                            step={1}
                            value={[line.shadowOffsetY]}
                            onValueChange={(value) => updateTextLine(line.id, "shadowOffsetY", value[0])}
                            className="pt-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`shadow-blur-${line.id}`}>Desfoque: {line.shadowBlur}px</Label>
                          <Slider
                            id={`shadow-blur-${line.id}`}
                            min={0}
                            max={50}
                            step={1}
                            value={[line.shadowBlur]}
                            onValueChange={(value) => updateTextLine(line.id, "shadowBlur", value[0])}
                            className="pt-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`shadow-color-${line.id}`}>Cor da Sombra</Label>
                          <div className="flex gap-2">
                            <Input
                              id={`shadow-color-${line.id}`}
                              type="color"
                              value={line.shadowColor}
                              onChange={(e) => updateTextLine(line.id, "shadowColor", e.target.value)}
                              className="h-10 w-20 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={line.shadowColor}
                              onChange={(e) => updateTextLine(line.id, "shadowColor", e.target.value)}
                              className="flex-1"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                      <Label className="text-base font-semibold">Contorno</Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`stroke-width-${line.id}`}>Largura: {line.strokeWidth}px</Label>
                          <Slider
                            id={`stroke-width-${line.id}`}
                            min={0}
                            max={20}
                            step={1}
                            value={[line.strokeWidth]}
                            onValueChange={(value) => updateTextLine(line.id, "strokeWidth", value[0])}
                            className="pt-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`stroke-color-${line.id}`}>Cor do Contorno</Label>
                          <div className="flex gap-2">
                            <Input
                              id={`stroke-color-${line.id}`}
                              type="color"
                              value={line.strokeColor}
                              onChange={(e) => updateTextLine(line.id, "strokeColor", e.target.value)}
                              className="h-10 w-20 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={line.strokeColor}
                              onChange={(e) => updateTextLine(line.id, "strokeColor", e.target.value)}
                              className="flex-1"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={addTextLine} variant="outline" className="w-full bg-transparent cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Nova Linha
            </Button>

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-8">
                <div
                  className="flex flex-col items-center justify-center rounded-md bg-white p-8 shadow-sm"
                  style={{ minWidth: "400px", minHeight: "300px" }}
                >
                  {textLines.map((line) => {
                    const textStyle: React.CSSProperties = {
                      fontFamily: line.oldFontFamily ?? line.fontFamily,
                      fontSize: `${line.fontSize}px`,
                      color: line.color,
                      lineHeight: "1.2",
                      fontWeight: line.bold ? 700 : line.fontWeight,
                      fontStyle: line.italic ? "italic" : "normal",
                      textDecoration:
                        `${line.underline ? "underline" : ""} ${line.strikethrough ? "line-through" : ""}`.trim(),
                      opacity: line.opacity / 100,
                      textShadow:
                        line.shadowBlur > 0 || line.shadowOffsetX !== 0 || line.shadowOffsetY !== 0
                          ? `${line.shadowOffsetX}px ${line.shadowOffsetY}px ${line.shadowBlur}px ${line.shadowColor}`
                          : "none",
                      WebkitTextStroke: line.strokeWidth > 0 ? `${line.strokeWidth}px ${line.strokeColor}` : "none",
                    }

                    return (
                      <p key={line.id} style={textStyle} className="text-center">
                        {line.text}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>

            <canvas ref={canvasRef} width={1200} height={800} className="hidden" />

            <Button onClick={handleDownload} size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Baixar Imagem (Fundo Transparente)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
