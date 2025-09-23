"use client"

import React, { useState } from "react"
import { Sidebar, MobileSidebar } from "./components/sidebar/sidebar"
import { UploadImage } from "./components/upload-image/upload-image"
import { Prompt } from "./components/prompt/prompt"
import { Gallery } from "./components/gallery/gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Settings, Sparkles, TrendingUp, Clock, Star } from "lucide-react"
import { Settings as SettingsComponent } from "./components/settings/settings"
import { Thumbnaill } from "./components/history/history"
import type { Pages } from "@/common/types/pages"
import { useThumbnaill } from "./context/use-thumbnaill"

const DashboardHome: React.FC<{
  setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>
}> = ({
  setCurrentPage
}) => {
  const { count } = useThumbnaill()
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground text-pretty">Bem-vindo ao seu criador de thumbnails com IA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thumbnails Criadas</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ count }</div>
              <p className="text-xs text-muted-foreground">muito rapidamente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Economizado</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ Math.ceil((count * 40) / 60) }h</div>
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
      </div>
    )
  }

const CreateThumbnail = () => {
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

const ThumbnailDashboard = () => {
  const [currentPage, setCurrentPage] = useState<Pages>("dashboard")

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardHome setCurrentPage={setCurrentPage} />
      case "upload":
        return <CreateThumbnail />
      case "gallery":
        return <Gallery />
      case "history":
        return <Thumbnaill />
      case "settings":
        return <SettingsComponent />
      default:
        return <DashboardHome setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <div className="flex h-screen">
        <div className="hidden md:block w-80 border-r border-border">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="font-semibold">Thumbnail AI</h1>
            </div>
            <MobileSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-8">{renderContent()}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ThumbnailDashboard