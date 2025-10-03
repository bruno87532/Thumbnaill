import type { Layer } from "@/common/types/layer"
import React from "react"

export const UsePhotoEditor = (
  setBackgroundImage: React.Dispatch<React.SetStateAction<string | null>>,
  backgroundImage: string | null,
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>,
  selectedLayerId: string | null,
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>,
  layers: Layer[],
  layerInputRef: React.RefObject<HTMLInputElement | null>,
  canvasDimensions: { width: number; height: number },
  setCanvasDimensions: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>,
) => {
   const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imgSrc = event.target?.result as string
        const img = new Image()
        img.onload = () => {
          setCanvasDimensions({ width: img.naturalWidth, height: img.naturalHeight })
          setBackgroundImage(imgSrc)
        }
        img.src = imgSrc
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
          const imgSrc = event.target?.result as string
          const img = new Image()
          img.onload = () => {
            // Use natural dimensions or scale down if too large
            const maxSize = 400
            let width = img.naturalWidth
            let height = img.naturalHeight

            if (width > maxSize || height > maxSize) {
              const ratio = Math.min(maxSize / width, maxSize / height)
              width = width * ratio
              height = height * ratio
            }

            const newLayer: Layer = {
              id: `layer-${Date.now()}-${Math.random()}`,
              src: imgSrc,
              x: 100,
              y: 100,
              width: width,
              height: height,
              rotation: 0,
              name: file.name,
            }
            setLayers((prev) => [...prev, newLayer])
          }
          img.src = imgSrc
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
    canvas.width = canvasDimensions.width
    canvas.height = canvasDimensions.height
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    
    if (backgroundImage) {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height)
      const img = new Image()
      img.crossOrigin = "anonymous"
      await new Promise((resolve) => {
        img.onload = resolve
        img.src = backgroundImage
      })
      ctx.drawImage(img, 0, 0, canvasDimensions.width, canvasDimensions.height)
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