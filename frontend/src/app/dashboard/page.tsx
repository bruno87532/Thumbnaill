"use client"

import { useState } from "react"
import { Sidebar, MobileSidebar } from "./components/sidebar/sidebar"
import { UploadImage } from "./components/upload-image/upload-image"
import { Quality } from "./components/quality/quality"
import { Prompt } from "./components/prompt/prompt"
import { Gallery } from "./components/gallery/gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Settings, Sparkles, TrendingUp, Clock, Star } from "lucide-react"
import { Settings as SettingsComponent } from "./components/settings/settings"
import { Thumbnaill } from "./components/history/history"

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground text-pretty">Bem-vindo ao seu criador de thumbnails com IA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thumbnails Criadas</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Economizado</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12h</div>
            <p className="text-xs text-muted-foreground">vs criação manual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualidade Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">de 5 estrelas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
              <Upload className="h-6 w-6" />
              <span>Nova Thumbnail</span>
            </Button>
            <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
              <ImageIcon className="h-6 w-6" />
              <span>Ver Galeria</span>
            </Button>
            <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
              <Settings className="h-6 w-6" />
              <span>Configurações</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Thumbnail "Gaming Epic" criada</p>
                <p className="text-xs text-muted-foreground">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">3 imagens enviadas</p>
                <p className="text-xs text-muted-foreground">Há 4 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Qualidade melhorada para "Alta"</p>
                <p className="text-xs text-muted-foreground">Ontem</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CreateThumbnail() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Criar Thumbnail</h1>
        <p className="text-muted-foreground text-pretty">
          Transforme suas ideias em thumbnails profissionais para YouTube, TikTok e Instagram
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="upload" className="flex items-center gap-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload & Descrição
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Prompt & Configurações
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2 cursor-pointer">
            <ImageIcon className="h-4 w-4" />
            Qualidade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <UploadImage />
        </TabsContent>

        <TabsContent value="prompt" className="space-y-6">
          <Prompt />
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Quality />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ThumbnailDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardHome />
      case "upload":
        return <CreateThumbnail />
      case "gallery":
        return <Gallery />
      case "history":
        return <Thumbnaill />
      case "settings":
        return <SettingsComponent />
      case "profile":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Perfil</h1>
            <p className="text-muted-foreground">Gerencie sua conta</p>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary font-semibold">U</span>
                </div>
                <h3 className="font-semibold mb-2">Usuário</h3>
                <p className="text-muted-foreground text-center">Configurações de perfil em desenvolvimento</p>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-80 border-r border-border">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="font-semibold">Thumbnail AI</h1>
            </div>
            <MobileSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>

          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-8">{renderContent()}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
