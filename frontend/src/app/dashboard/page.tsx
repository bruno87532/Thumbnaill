"use client"

import React, { useState } from "react"
import { Sidebar, MobileSidebar } from "./components/sidebar/sidebar"
import { UploadDescription } from "./components/upload-description/upload-description"
import { Gallery } from "./components/gallery/gallery"
import { Sparkles } from "lucide-react"
import { Settings as SettingsComponent } from "./components/settings/settings"
import { Thumbnaill } from "./components/history/history"
import type { Pages } from "@/common/types/pages"
import { DescribeThumb } from "./components/describe-thumb/describe-thumb"
import { Home } from "./components/home/home"
import { CreateText } from "./components/create-text/create-text"
import { PhotoEditor } from "./components/photo-editor/photo-editor"

const ThumbnailDashboard = () => {
  const [currentPage, setCurrentPage] = useState<Pages>("dashboard")

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Home setCurrentPage={setCurrentPage} />
      case "upload":
        return <UploadDescription />
      case "gallery":
        return <Gallery />
      case "history":
        return <Thumbnaill />
      case "settings":
        return <SettingsComponent />
      case "describe-thumb":
        return <DescribeThumb />
      case "create-text":
        return <CreateText />
      case "photo-editor":
        return <PhotoEditor />
      default:
        return <Home setCurrentPage={setCurrentPage} />
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