import type { Layer } from "@/common/types/layer"
import React from "react"

export const UsePhotoEditor = (
  setBackgroundImage: React.Dispatch<React.SetStateAction<string | null>>,
  backgroundImage: string | null,
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>,
  selectedLayerId: string | null,
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>,
  layers: Layer[],
  layerInputRef: React.RefObject<HTMLInputElement | null>
) => {
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setBackgroundImage(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  
    const handleLayerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            const newLayer: Layer = {
              id: `layer-${Date.now()}-${Math.random()}`,
              src: event.target?.result as string,
              x: 100,
              y: 100,
              width: 200,
              height: 200,
              rotation: 0,
              name: file.name,
            }
            setLayers((prev) => [...prev, newLayer])
          }
          reader.readAsDataURL(file)
        })
      }

      if (layerInputRef.current) {
        layerInputRef.current.value = ""
      }
    }
  
    const updateLayer = (id: string, updates: Partial<Layer>) => {
      setLayers((prev) => prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer)))
    }
  
    const deleteLayer = (id: string) => {
      setLayers((prev) => prev.filter((layer) => layer.id !== id))
      if (selectedLayerId === id) {
        setSelectedLayerId(null)
      }
    }
  
    const moveLayerUp = (id: string) => {
      setLayers((prev) => {
        const index = prev.findIndex((l) => l.id === id)
        if (index < prev.length - 1) {
          const newLayers = [...prev]
          ;[newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]]
          return newLayers
        }
        return prev
      })
    }
  
    const moveLayerDown = (id: string) => {
      setLayers((prev) => {
        const index = prev.findIndex((l) => l.id === id)
        if (index > 0) {
          const newLayers = [...prev]
          ;[newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]]
          return newLayers
        }
        return prev
      })
    }
  
    const exportImage = async (format: "png" | "jpeg") => {
      const canvas = document.createElement("canvas")
      canvas.width = 800
      canvas.height = 600
      const ctx = canvas.getContext("2d")
  
      if (!ctx) return
  
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, 800, 600)
  
      // Draw background image
      if (backgroundImage) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        await new Promise((resolve) => {
          img.onload = resolve
          img.src = backgroundImage
        })
        ctx.drawImage(img, 0, 0, 800, 600)
      }
  
      for (const layer of layers) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        await new Promise((resolve) => {
          img.onload = resolve
          img.src = layer.src
        })
  
        ctx.save()
        ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2)
        ctx.rotate((layer.rotation * Math.PI) / 180)
        ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height)
        ctx.restore()
      }
  
      const mimeType = format === "png" ? "image/png" : "image/jpeg"
      const dataUrl = canvas.toDataURL(mimeType, 0.95)
      const link = document.createElement("a")
      link.download = `photo-edit.${format}`
      link.href = dataUrl
      link.click()
    }

    return { handleBackgroundUpload, handleLayerUpload, updateLayer, deleteLayer, moveLayerUp, moveLayerDown, exportImage }
}