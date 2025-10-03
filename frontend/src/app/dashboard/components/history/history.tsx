"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Download, Trash2, MoreVertical, Eye } from "lucide-react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useThumbnaill } from "../../context/use-thumbnaill"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ThumbnaillService } from "@/services/thumbnaill.service"
import { useHistory } from "./hook/use-history"

export const History = () => {
  const { urlThumbnaills, setUrlThumbnaills, isLoading } = useThumbnaill()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [imageToPreview, setImageToPreview] = useState<string | null>(null)

  const { 
    handleDeleteClick, 
    handleDeleteConfirm, 
    handleDownload, 
    handlePreviewClick 
  } = useHistory(
    setImageToPreview,
    setPreviewDialogOpen,
    setImageToDelete,
    imageToDelete,
    setDeleteDialogOpen
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Thumbnaills Geradas</h1>
          <p className="text-muted-foreground text-pretty">Todas as suas thumbnails criadas com IA</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {urlThumbnaills.length} {urlThumbnaills.length === 1 ? "imagem" : "imagens"}
          </Badge>
        </div>
      </div>

      {
        isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) :
          urlThumbnaills.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Nenhuma thumbnaill gerada</h3>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {urlThumbnaills.map((thumbnaill, index) => (
                <Card key={index} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={thumbnaill.url || "/placeholder.svg"}
                      alt="Imagem salva"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 cursor-pointer">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handlePreviewClick(thumbnaill.url)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownload(thumbnaill.url, index)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => handleDeleteClick(thumbnaill.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
      }

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Visualizar Thumbnaill</DialogTitle>
          </DialogHeader>
          <div className="relative flex-1 p-6 pt-2">
            {imageToPreview && (
              <div className="relative w-full h-[60vh] bg-muted rounded-lg overflow-hidden">
                <Image
                  src={imageToPreview || "/placeholder.svg"}
                  alt="Imagem em tamanho maior"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
