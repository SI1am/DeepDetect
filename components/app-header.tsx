"use client"

import { History, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">Video Analysis Dashboard</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Upload and analyze videos for deepfake detection</p>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <History className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xs:inline">History</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
