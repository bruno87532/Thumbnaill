import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { UploadImage } from "./components/upload-image/upload-image"
import { Prompt } from "./components/prompt/prompt"
import { Settings, Upload } from "lucide-react"

export const UploadDescription = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Criar Thumbnail</h1>
        <p className="text-muted-foreground text-pretty">
          Transforme suas ideias em thumbnails profissionais para YouTube, TikTok e Instagram
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upload" className="flex items-center gap-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload & Descrição
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Prompt & Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <UploadImage />
        </TabsContent>

        <TabsContent value="prompt" className="space-y-6">
          <Prompt />
        </TabsContent>
      </Tabs>
    </div>
  )
}