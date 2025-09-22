"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThumbnaillService } from "@/services/thumbnaill.service"

type UrlThumbnaill = {
  url: string,
  id: string
}

type ThumbnaillContext = {
  urlThumbnaills: UrlThumbnaill[]
  setUrlThumbnaills: React.Dispatch<React.SetStateAction<UrlThumbnaill[]>>
}

const ThumbnaillContext = createContext<ThumbnaillContext | undefined>(undefined)

export const ThumbnaillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urlThumbnaills, setUrlThumbnaills] = useState<{
    url: string,
    id: string
  }[]>([])

  useEffect(() => {
    const getThumbnaillsByIdUser = async () => {
      const thumbnaills = await ThumbnaillService.getThumbnaillsByIdUser()
      setUrlThumbnaills(() => {
        return thumbnaills.map((thumbnaill) => {
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
    <ThumbnaillContext.Provider value={{ urlThumbnaills, setUrlThumbnaills }}>
      {children}
    </ThumbnaillContext.Provider>
  )
}

export const useThumbnaill = () => {
  const context = useContext(ThumbnaillContext)
  if (!context) throw new Error("useThumbnaill must be used within an ThumbnaillProvider")
  return context
}