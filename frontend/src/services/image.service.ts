import axios from "axios"

export class ImageService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async createImage(images: File[]) {
    const formData = new FormData()

    images.forEach((file) => {
      formData.append("images", file)
    })

    await axios.post(this.pathBackend + "/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    })
  }

  static async getImagesByIdUser(): Promise<{
    buffer: {
      type: "Buffer",
      data: number[],
      ContentType: string
    },
    id: string
  }[]> {
    const response = await axios.get(this.pathBackend + "/image/idUser", {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    })
    return response.data
  }

  static async deleteImageById(id: string) {
    const response = await axios.delete(this.pathBackend + "/image/" + id, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
  }
}
