"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Sparkles } from "lucide-react"

export const Quality = () => {
  const [qualityMode, setQualityMode] = useState<"medium" | "high">("medium")

  return (
    <>
      <Card className="gradient-card neon-glow-hover">
        <CardHeader>
          <CardTitle>Configuração de Qualidade</CardTitle>
          <CardDescription>Escolha entre velocidade e qualidade da geração</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={qualityMode === "medium" ? "default" : "outline"}
              className={`h-24 flex-col gap-2 ${qualityMode === "medium" ? "gradient-primary text-primary-foreground neon-glow" : ""}`}
              onClick={() => setQualityMode("medium")}
            >
              <Zap className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Qualidade Média</div>
                <div className="text-xs opacity-80">Mais rápido</div>
              </div>
            </Button>

            <Button
              variant={qualityMode === "high" ? "default" : "outline"}
              className={`h-24 flex-col gap-2 ${qualityMode === "high" ? "gradient-primary text-primary-foreground neon-glow" : ""}`}
              onClick={() => setQualityMode("high")}
            >
              <Sparkles className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Qualidade Alta</div>
                <div className="text-xs opacity-80">Mais detalhado</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
