"use client"

import { useState, useEffect, useCallback } from "react"
import type { DetectionResult } from "@/lib/api-client"

const STORAGE_KEY = "deepfake_detection_history"

export function useHistory() {
  const [history, setHistory] = useState<DetectionResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (err) {
      console.error("Failed to load history:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addToHistory = useCallback((result: DetectionResult) => {
    setHistory((prev) => {
      const updated = [result, ...prev].slice(0, 50) // Keep last 50
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (err) {
        console.error("Failed to save to history:", err)
      }
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.error("Failed to clear history:", err)
    }
  }, [])

  return {
    history,
    loading,
    addToHistory,
    clearHistory,
  }
}
