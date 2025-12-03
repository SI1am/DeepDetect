"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { MainContent } from "@/components/main-content"
import { ExplainabilityPanel } from "@/components/explainability-panel"
import { Button } from "@/components/ui/button"

export function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-background text-foreground">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row w-full">
          <MainContent />

          <div
            className={`
              fixed lg:static lg:block
              bottom-0 left-0 right-0 top-auto lg:top-0
              w-full lg:w-80 h-[50vh] lg:h-auto
              bg-background lg:bg-card
              z-40 lg:z-auto
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
              border-t lg:border-t-0 lg:border-l border-border
              shadow-lg lg:shadow-none
              overflow-auto
            `}
          >
            <ExplainabilityPanel onClose={() => setIsSidebarOpen(false)} />
          </div>

          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 lg:hidden z-50 shadow-lg hover-lift"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
