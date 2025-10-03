"use client"

import { forwardRef } from "react"
import { DraggableLayer } from "../draggable-layer/draggable-layer"
import type { Layer } from "@/common/types/layer"

interface CanvasProps {
  backgroundImage: string | null
  layers: Layer[]
  selectedLayerId: string | null
  onSelectLayer: (id: string) => void
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void
  canvasDimensions: { width: number; height: number }
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ backgroundImage, layers, selectedLayerId, onSelectLayer, onUpdateLayer, canvasDimensions }, ref) => {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-lg border-2 border-border bg-white shadow-2xl"
        style={{ width: canvasDimensions.width, height: canvasDimensions.height }}
      >
        {backgroundImage ? (
          <img
            src={backgroundImage || "/placeholder.svg"}
            alt="Background"
            className="absolute inset-0"
            style={{ width: canvasDimensions.width, height: canvasDimensions.height }}
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/50">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">No background image</p>
              <p className="text-sm text-muted-foreground">Upload one to get started</p>
            </div>
          </div>
        )}

        {layers.map((layer) => (
          <DraggableLayer
            key={layer.id}
            layer={layer}
            isSelected={selectedLayerId === layer.id}
            onSelect={() => onSelectLayer(layer.id)}
            onUpdate={(updates) => onUpdateLayer(layer.id, updates)}
          />
        ))}
      </div>
    )
  },
)

Canvas.displayName = "Canvas"
