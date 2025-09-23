import axios from "axios"
import { Config, QualityMode } from "@/common/types/config"
import { ConfigEnum } from "@/common/types/config"

export class ConfigService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async udpateConfig(data: Config) {
    const response = await axios.put(this.pathBackend + "/config/idUser", data, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })

    return response.data
  } 

  static async getConfigByIdUser(): Promise<{
    civicIntegrity: ConfigEnum,
    dangerousContent: ConfigEnum,
    harassmentIntimidation: ConfigEnum,
    hateSpeech: ConfigEnum,
    sexual: ConfigEnum
    qualityMode: QualityMode
  }> {
    const response = await axios.get(this.pathBackend + "/config/idUser", {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
    
    return response.data
  }
}