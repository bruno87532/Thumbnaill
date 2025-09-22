import axios from "axios"
import { Config } from "@/common/types/config"

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
}