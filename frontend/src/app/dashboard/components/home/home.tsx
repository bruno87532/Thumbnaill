import type { Pages } from "@/common/types/pages"
import { useThumbnaill } from "../../context/use-thumbnaill"
import { Loader2, ImageIcon, Upload, Clock, Settings } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const Home: React.FC<{
  setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>
}> = ({
  setCurrentPage
}) => {
    const { count, isLoading } = useThumbnaill()

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground text-pretty">Bem-vindo ao seu criador de thumbnails com IA</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Thumbnails Criadas</CardTitle>
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">muito rapidamente</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Economizado</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.ceil((count * 40) / 60)}h</div>
                  <p className="text-xs text-muted-foreground">vs criação manual</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    className="h-20 flex-col gap-2 bg-transparent cursor-pointer" variant="outline"
                    onClick={() => {
                      setCurrentPage("upload")
                    }}
                  >
                    <Upload className="h-6 w-6" />
                    <span>Nova Thumbnail</span>
                  </Button>
                  <Button
                    className="h-20 flex-col gap-2 bg-transparent cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      setCurrentPage("gallery")
                    }}
                  >
                    <ImageIcon className="h-6 w-6" />
                    <span>Ver Galeria</span>
                  </Button>
                  <Button
                    className="h-20 flex-col gap-2 bg-transparent cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      setCurrentPage("settings")
                    }}
                  >
                    <Settings className="h-6 w-6" />
                    <span>Configurações</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    )
  }