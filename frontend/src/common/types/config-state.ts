import { QualityMode } from "./config"
import { ConfigEnum } from "./config"

export type ConfigState = {
  civicIntegrity: ConfigEnum
  dangerousContent: ConfigEnum
  harassmentIntimidation: ConfigEnum
  hateSpeech: ConfigEnum
  sexual: ConfigEnum
  qualityMode: QualityMode
}