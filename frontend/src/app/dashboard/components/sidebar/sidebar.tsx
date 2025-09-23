"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Upload, Settings, Battery as Gallery, Home, Menu, Sparkles, History, User, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Pages } from "@/common/types/pages"

const menuItems: {
  id: Pages,
  label: string,
  icon: LucideIcon,
  description: string,
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    description: "Página inicial",
  },
  {
    id: "upload",
    label: "Upload & Criação",
    icon: Upload,
    description: "Enviar imagens e criar thumbnails",
  },
  {
    id: "gallery",
    label: "Galeria",
    icon: Gallery,
    description: "Ver todas as imagens",
  },
  {
    id: "history",
    label: "Histórico",
    icon: History,
    description: "Thumbnails geradas",
  },
  {
    id: "settings",
    label: "Configurações",
    icon: Settings,
    description: "Ajustes e preferências",
  },
]

export const Sidebar: React.FC<{
  currentPage: string
  onPageChange: (page: Pages) => void
}> = ({
  currentPage,
  onPageChange
}) => {
    return (
      <div className={cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border")}>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Thumbnail AI</h2>
              <p className="text-xs text-sidebar-foreground/60">Criador de Thumbnails</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 px-3 cursor-pointer",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                  )}
                  onClick={() => onPageChange(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{item.label}</span>
                    <span className="text-xs opacity-60">{item.description}</span>
                  </div>
                </Button>
              )
            })}
          </div>
        </nav>
      </div>
    )
  }

export const MobileSidebar: React.FC<{
  currentPage: string
  onPageChange: (page: Pages) => void
}> = ({ currentPage, onPageChange }) => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80">
        <Sidebar
          currentPage={currentPage}
          onPageChange={(page) => {
            onPageChange(page)
            setOpen(false)
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
