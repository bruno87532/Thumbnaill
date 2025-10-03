import axios from "axios"

export class DescribeThumbnaillService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async describeThumbnaill(file: File, model: string): Promise<{
    response: string
  }> {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("model", model)
    const response = await axios.post(this.pathBackend + "/describe-thumbnaill", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    })
    return {
      response: response.data.response
    }
  }
}