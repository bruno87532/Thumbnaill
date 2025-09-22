"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ImageService } from "@/services/image.service"


type UrlImage = {
  url: string,
  id: string
}

type ImageContext = {
  urlImages: UrlImage[]
  setUrlImages: React.Dispatch<React.SetStateAction<UrlImage[]>>
}

const ImageContext = createContext<ImageContext | undefined>(undefined)

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urlImages, setUrlImages] = useState<{
    url: string,
    id: string
  }[]>([])

  useEffect(() => {
    const getImagesByIdUser = async () => {
      const images = await ImageService.getImagesByIdUser()
      setUrlImages(() => {
        return images.map((image) => {
          const uint8 = new Uint8Array(image.buffer.data)
          const blob = new Blob([uint8], { type: image.buffer.ContentType })
          const url = URL.createObjectURL(blob)
          return {
            url,
            id: image.id
          }
        })
      })
    }

    getImagesByIdUser()
  }, [])

  return (
    <ImageContext.Provider value={{ urlImages, setUrlImages }}>
      {children}
    </ImageContext.Provider>
  )
}

export const useImage = () => {
  const context = useContext(ImageContext)
  if (!context) throw new Error("useImage must be used within an ImageProvider")
  return context
}