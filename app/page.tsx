"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HomePage } from "@/components/pages/home-page"
import { DashboardPage } from "@/components/pages/dashboard-page"

type PageType = "home" | "dashboard"

export default function RootPage() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      {currentPage === "home" && <HomePage onStartAnalysis={() => setCurrentPage("dashboard")} />}
      {currentPage === "dashboard" && <DashboardPage />}
    </div>
  )
}
