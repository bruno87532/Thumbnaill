import { useForm } from "react-hook-form"
import { SettingsSchemaType, SettingsSchema } from "../schema/settings.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConfigService } from "@/services/config.service"
import { useEffect } from "react"
import { ConfigState } from "@/common/types/config-state"
import { toast } from "sonner"
import { ConfigEnum } from "@/common/types/config"
import { configLabels } from "@/common/types/config"

export const useSettings = (
  setConfig: React.Dispatch<React.SetStateAction<ConfigState>>,
  config: ConfigState,
) => {
  const form = useForm<SettingsSchemaType>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: config,
  })

  useEffect(() => {
    const getConfigByIdUser = async () => {
      const cfg = await ConfigService.getConfigByIdUser()
      setConfig({
        civicIntegrity: cfg.civicIntegrity,
        dangerousContent: cfg.dangerousContent,
        harassmentIntimidation: cfg.harassmentIntimidation,
        hateSpeech: cfg.hateSpeech,
        sexual: cfg.sexual,
        qualityMode: cfg.qualityMode,
      })
    }

    getConfigByIdUser()
  }, [])

  useEffect(() => {
    form.reset(config)
  }, [config, form, setConfig])

  const handleSubmit = async (data: SettingsSchemaType) => {
    await ConfigService.udpateConfig(data)
    toast("Configurações atualizadas", {
      description: "Configurações atualizadas com sucesso",
      action: { label: "Feito", onClick: () => null },
    })
  }

  const setAllConfigs = (value: ConfigEnum) => {
    const configKeys: (keyof typeof configLabels)[] = [
      "civicIntegrity",
      "dangerousContent",
      "harassmentIntimidation",
      "hateSpeech",
      "sexual",
    ]
    configKeys.forEach((key) => form.setValue(key, value))
  }

  return { handleSubmit, setAllConfigs, form }
}