"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilitySettings {
  largeText: boolean
  highContrast: boolean
  keyboardNavigation: boolean
  screenReader: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void
  resetSettings: () => void
}

const defaultSettings: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  keyboardNavigation: true,
  screenReader: false,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("lazarus_accessibility")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Error loading accessibility settings:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement

    // Large text
    if (settings.largeText) {
      root.classList.add("text-large")
    } else {
      root.classList.remove("text-large")
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Keyboard navigation
    if (settings.keyboardNavigation) {
      root.classList.add("keyboard-navigation")
    } else {
      root.classList.remove("keyboard-navigation")
    }

    // Screen reader optimizations
    if (settings.screenReader) {
      root.classList.add("screen-reader-optimized")
    } else {
      root.classList.remove("screen-reader-optimized")
    }

    // Save settings
    localStorage.setItem("lazarus_accessibility", JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
