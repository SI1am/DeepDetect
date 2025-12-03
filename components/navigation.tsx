"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentPage: "home" | "dashboard"
  onNavigate: (page: "home" | "dashboard") => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Logo />
            <span className="text-xl font-bold hidden sm:inline">DeepDetect</span>
          </button>

          <div className="flex items-center gap-4">
            <Button
              variant={currentPage === "home" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate("home")}
              className="hidden sm:inline-flex"
            >
              Home
            </Button>
            <Button
              variant={currentPage === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate("dashboard")}
            >
              Analyze
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
