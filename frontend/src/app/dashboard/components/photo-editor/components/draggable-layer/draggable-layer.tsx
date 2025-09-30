"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import type { Layer } from "@/common/types/layer"
import { useDraggableLayer } from "./hook/use-draggable-layer"
interface DraggableLayerProps {
  layer: Layer
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Layer>) => void
}

export function DraggableLayer({ layer, isSelected, onSelect, onUpdate }: DraggableLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const resizeStartData = useRef({ width: 0, height: 0, x: 0, y: 0 })
  const rotateStartAngle = useRef(0)

  const {
    handleMouseDown, 
    handleResizeMouseDown,
    handleRotateMouseDown
  } = useDraggableLayer(
    layer,
    onSelect, 
    setIsDragging,
    isDragging,
    setIsResizing,
    isResizing,
    setIsRotating,
    isRotating,
    resizeStartData,
    dragStartPos,
    layerRef,
    onUpdate,
    rotateStartAngle,
  )

  return (
    <div
      ref={layerRef}
      className="absolute cursor-move"
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        transform: `rotate(${layer.rotation}deg)`,
        transformOrigin: "center",
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={layer.src || "/placeholder.svg"}
        alt={layer.name}
        className="h-full w-full object-contain pointer-events-none select-none"
        draggable={false}
      />

      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-primary pointer-events-none" />
          <div
            className="absolute -bottom-2 -right-2 h-6 w-6 cursor-nwse-resize rounded-full border-2 border-primary bg-white shadow-md hover:scale-110 transition-transform"
            onMouseDown={handleResizeMouseDown}
          />
          <div
            className="absolute -top-8 left-1/2 h-6 w-6 -translate-x-1/2 cursor-grab rounded-full border-2 border-accent bg-white shadow-md hover:scale-110 transition-transform"
            onMouseDown={handleRotateMouseDown}
          >
            <svg className="h-full w-full p-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
