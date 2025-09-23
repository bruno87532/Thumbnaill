"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThumbnaillService } from "@/services/thumbnaill.service"

type UrlThumbnaill = {
  url: string;
  id: string;
}

type ThumbnaillContext = {
  urlThumbnaills: UrlThumbnaill[];
  setUrlThumbnaills: React.Dispatch<React.SetStateAction<UrlThumbnaill[]>>;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const ThumbnaillContext = createContext<ThumbnaillContext | undefined>(undefined)

export const ThumbnaillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urlThumbnaills, setUrlThumbnaills] = useState<{
    url: string,
    id: string
  }[]>([])
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    const getThumbnaillsByIdUser = async () => {
      const response = await ThumbnaillService.getThumbnaillsByIdUser()
      setCount(response.count)
      setUrlThumbnaills(() => {
        return response.imagesFile.map((thumbnaill) => {
          const uint8 = new Uint8Array(thumbnaill.buffer.data)
          const blob = new Blob([uint8], { type: thumbnaill.buffer.ContentType })
          const url = URL.createObjectURL(blob)
          return {
            url,
            id: thumbnaill.id
          }
        })
      })
    }

    getThumbnaillsByIdUser()
  }, [])

  return (
    <ThumbnaillContext.Provider value={{ urlThumbnaills, setUrlThumbnaills, count, setCount }}>
      {children}
    </ThumbnaillContext.Provider>
  )
}

export const useThumbnaill = () => {
  const context = useContext(ThumbnaillContext)
  if (!context) throw new Error("useThumbnaill must be used within an ThumbnaillProvider")
  return context
}