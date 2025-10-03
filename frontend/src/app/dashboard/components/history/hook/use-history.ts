import { ThumbnaillService } from "@/services/thumbnaill.service"
import { useThumbnaill } from "@/app/dashboard/context/use-thumbnaill"
import { toast } from "sonner"

export const useHistory = (
  setImageToPreview: React.Dispatch<React.SetStateAction<string | null>>,
  setPreviewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setImageToDelete: React.Dispatch<React.SetStateAction<string | null>>,
  imageToDelete: string | null,
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { setUrlThumbnaills, urlThumbnaills } = useThumbnaill()

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
      const imageDeleted = urlThumbnaills.find((thumbnaill) => thumbnaill.id === imageToDelete)
      if (!imageDeleted) return

      ThumbnaillService.deleteImageById(imageToDelete)
      URL.revokeObjectURL(imageDeleted.url)
      setUrlThumbnaills((prev) => {
        return prev.filter((item) => item.id !== imageToDelete)
      })
      setImageToDelete(null)
    }
    setDeleteDialogOpen(false)
    toast("Thumbnaill deletada", {
      description: "Thumbnaill deletada com sucesso",
      action: {
        label: "Feito",
        onClick: () => null,
      },
    })
  }

  return { handleDownload, handlePreviewClick, handleDeleteClick, handleDeleteConfirm }
}