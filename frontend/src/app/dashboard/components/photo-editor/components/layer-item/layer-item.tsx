"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Trash2, ChevronUp, ChevronDown, RotateCw, Maximize2 } from "lucide-react"
import type { Layer } from "@/common/types/layer"

interface LayerItemProps {
  layer: Layer
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  onUpdate: (updates: Partial<Layer>) => void
}

export function LayerItem({
  layer,
  isSelected,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onUpdate,
}: LayerItemProps) {
  return (
    <Card
      className={`overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"}`}
      onClick={onSelect}
    >
      <div className="flex gap-3 p-3">
        <div className="flex-shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded border border-border bg-muted">
            <img src={layer.src || "/placeholder.svg"} alt={layer.name} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-foreground truncate">{layer.name}</p>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveUp()
                }}
                disabled={!canMoveUp}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveDown()
                }}
                disabled={!canMoveDown}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isSelected && (
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-3 w-3 text-muted-foreground" />
                  <Label className="text-xs text-muted-foreground">Size</Label>
                </div>
                <Slider
                  value={[layer.width]}
                  onValueChange={([width]) => onUpdate({ width, height: width })}
                  min={50}
                  max={600}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{layer.width}px</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <RotateCw className="h-3 w-3 text-muted-foreground" />
                  <Label className="text-xs text-muted-foreground">Rotation</Label>
                </div>
                <Slider
                  value={[layer.rotation]}
                  onValueChange={([rotation]) => onUpdate({ rotation })}
                  min={0}
                  max={360}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{Math.round(layer.rotation)}°</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
