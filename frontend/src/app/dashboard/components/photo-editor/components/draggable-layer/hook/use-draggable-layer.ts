import { Layer } from "@/common/types/layer"
import { useEffect } from "react"
import React from "react"

export const useDraggableLayer = (
  layer: Layer,
  onSelect: () => void,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  isDragging: boolean,
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>,
  isResizing: boolean,
  setIsRotating: React.Dispatch<React.SetStateAction<boolean>>,
  isRotating: boolean,
  resizeStartData: React.RefObject<{ width: number; height: number; x: number; y: number }>,
  dragStartPos: React.RefObject<{ x: number; y: number }>,
  layerRef: React.RefObject<HTMLDivElement | null>,
  onUpdate: (updates: Partial<Layer>) => void,
  rotateStartAngle: React.RefObject<number>
) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === layerRef.current || (e.target as HTMLElement).tagName === "IMG") {
      e.preventDefault()
      e.stopPropagation()
      onSelect()
      setIsDragging(true)
      dragStartPos.current = {
        x: e.clientX - layer.x,
        y: e.clientY - layer.y,
      }
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    setIsResizing(true)
    resizeStartData.current = {
      width: layer.width,
      height: layer.height,
      x: e.clientX,
      y: e.clientY,
    }
  }

  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    setIsRotating(true)
    const rect = layerRef.current?.getBoundingClientRect()
    if (rect) {
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
      rotateStartAngle.current = (angle * 180) / Math.PI - layer.rotation
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartPos.current) {
        const newX = e.clientX - dragStartPos.current.x
        const newY = e.clientY - dragStartPos.current.y
        onUpdate({
          x: Math.max(0, Math.min(800 - layer.width, newX)),
          y: Math.max(0, Math.min(600 - layer.height, newY)),
        })
      } else if (isResizing && resizeStartData.current) {
        const deltaX = e.clientX - resizeStartData.current.x
        const deltaY = e.clientY - resizeStartData.current.y
        const delta = Math.max(deltaX, deltaY)
        const newWidth = Math.max(50, resizeStartData.current.width + delta)
        const newHeight = Math.max(50, resizeStartData.current.height + delta)
        onUpdate({ width: newWidth, height: newHeight })
      } else if (isRotating && rotateStartAngle.current != null) {
        const rect = layerRef.current?.getBoundingClientRect()
        if (rect) {
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
          const rotation = (angle * 180) / Math.PI - rotateStartAngle.current
          onUpdate({ rotation })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setIsRotating(false)
    }

    if (isDragging || isResizing || isRotating) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, isRotating, layer, onUpdate])

  return {
    handleMouseDown,
    handleResizeMouseDown,
    handleRotateMouseDown,
  }
}
