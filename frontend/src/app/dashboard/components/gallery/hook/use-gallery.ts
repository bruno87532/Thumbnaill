import { ImageService } from "@/services/image.service"
import { useImage } from "@/app/dashboard/context/use-image"
import { toast } from "sonner"

export const useGallery = (
  setImageToPreview: React.Dispatch<React.SetStateAction<string | null>>,
  setPreviewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setImageToDelete: React.Dispatch<React.SetStateAction<string | null>>,
  imageToDelete: string | null,
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { urlImages, setUrlImages } = useImage()

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement("a")
    link.href = url
    link.download = `imagem-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreviewClick = (url: string) => {
    setImageToPreview(url)
    setPreviewDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (imageToDelete !== null) {
      const imageDeleted = urlImages.find((image) => image.id === imageToDelete)
      if (!imageDeleted) return

      ImageService.deleteImageById(imageToDelete)
      URL.revokeObjectURL(imageDeleted.url)
      setUrlImages((prev) => {
        return prev.filter((item) => item.id !== imageToDelete)
      })
      setImageToDelete(null)
    }
    setDeleteDialogOpen(false)
    toast("Imagem deletada", {
      description: "Imagem deletada com sucesso",
      action: {
        label: "Feito",
        onClick: () => null,
      },
    })
  }

  return { handleDownload, handlePreviewClick, handleDeleteClick, handleDeleteConfirm }
}