"use client"

import { Form, FormMessage, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { ConfigEnum, configEnumLabels, configLabels, QualityMode } from "@/common/types/config"
import { useState } from "react"
import { Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConfigState } from "@/common/types/config-state"
import { useSettings } from "./hook/use-settings"

export const Settings = () => {
  const [config, setConfig] = useState<ConfigState>({
    civicIntegrity: ConfigEnum.BLOCK_NONE,
    dangerousContent: ConfigEnum.BLOCK_NONE,
    harassmentIntimidation: ConfigEnum.BLOCK_NONE,
    hateSpeech: ConfigEnum.BLOCK_NONE,
    sexual: ConfigEnum.BLOCK_NONE,
    qualityMode: QualityMode.MEDIA_RESOLUTION_MEDIUM,
  })

  const { handleSubmit, setAllConfigs, form } = useSettings(setConfig, config)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Configurações Avançadas</h1>
          <p className="text-muted-foreground text-pretty">Configuração Individual por Categoria</p>
        </div>

        <Alert>
          <AlertDescription className="text-sm">
            Estas configurações não garante que gerará ou bloqueará determinados tipos de conteúdos, pois a inteligência artificial bloquea internamente certo tipo de conteúdo. Porém estas configurações ajuda a tornar menos restritivo.
          </AlertDescription>
          <AlertDescription className="text-sm">
            Recomendamos deixar tudo como &quot;Sem Bloqueio&quot;
          </AlertDescription>
        </Alert>

        <Card className="gradient-card neon-glow-hover">
          <CardHeader>
            <CardTitle>Configuração de Qualidade</CardTitle>
            <CardDescription>Escolha entre velocidade e qualidade da geração</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="qualityMode"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={field.value === QualityMode.MEDIA_RESOLUTION_LOW ? "default" : "outline"}
                      className={`h-24 cursor-pointer flex-col gap-2 ${field.value === QualityMode.MEDIA_RESOLUTION_LOW
                        ? "gradient-primary text-primary-foreground neon-glow"
                        : ""
                        }`}
                      onClick={() => field.onChange(QualityMode.MEDIA_RESOLUTION_LOW)}
                    >
                      <Zap className="h-6 w-6 rotate-180" />
                      <div className="text-center">
                        <div className="font-semibold">Qualidade Média</div>
                        <div className="text-xs opacity-80">Mais leve e rápida</div>
                      </div>
                    </Button>

                    <Button
                      type="button"
                      variant={field.value === QualityMode.MEDIA_RESOLUTION_MEDIUM ? "default" : "outline"}
                      className={`h-24 cursor-pointer flex-col gap-2 ${field.value === QualityMode.MEDIA_RESOLUTION_MEDIUM
                        ? "gradient-primary text-primary-foreground neon-glow"
                        : ""
                        }`}
                      onClick={() => field.onChange(QualityMode.MEDIA_RESOLUTION_MEDIUM)}
                    >
                      <Zap className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-semibold">Qualidade Alta</div>
                        <div className="text-xs opacity-80">Equilibrada</div>
                      </div>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
        </Card>

        <div className="space-y-4">
          {Object.entries(configLabels).map(([key, label]) => (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof typeof configLabels}
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-lg bg-muted/20">
                  <div className="flex-1">
                    <FormLabel className="text-sm font-medium cursor-pointer">{label}</FormLabel>
                  </div>
                  <div className="min-w-[200px]">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Selecionar nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(configEnumLabels).map(([enumValue, enumLabel]) => (
                          <SelectItem className="cursor-pointer" key={enumValue} value={enumValue}>
                            {enumLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Label className="text-sm font-medium mb-3 block">Configurações Rápidas</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer bg-transparent"
              size="sm"
              onClick={() => setAllConfigs(ConfigEnum.BLOCK_NONE)}
            >
              Não Bloquear
            </Button>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer bg-transparent"
              size="sm"
              onClick={() => setAllConfigs(ConfigEnum.BLOCK_MEDIUM_AND_ABOVE)}
            >
              Bloquear Conteúdo de Médio Risco ou Mais
            </Button>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer bg-transparent"
              size="sm"
              onClick={() => setAllConfigs(ConfigEnum.BLOCK_ONLY_HIGH)}
            >
              Bloquear Conteúdo de Alto Risco
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="min-w-[120px] cursor-pointer">
            Salvar Configurações
          </Button>
        </div>
      </form>
    </Form>
  )
}