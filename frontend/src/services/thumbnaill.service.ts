import axios from "axios"

export class ThumbnaillService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async createThumbnaill(data: { ids: string[], prompt: string }): Promise<{
    data: number[]
  }> {
    const response = await axios.post(this.pathBackend + "/thumbnaill", data, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
    return {
      data: response.data.buffer.data
    }
  }

  static async getThumbnaillsByIdUser(): Promise<{
    buffer: {
      type: "Buffer",
      data: number[],
      ContentType: string
    },
    id: string
  }[]> {
    const response = await axios.get(this.pathBackend + "/thumbnaill/idUser", {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    })
    return response.data
  }

  static async deleteImageById(id: string) {
    const response = await axios.delete(this.pathBackend + "/thumbnaill/" + id, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
  }
}