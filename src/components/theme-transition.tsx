"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeTransition() {
  const { theme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    
    // Add transition classes for smooth theme switching
    root.style.setProperty('--theme-transition-duration', '0.3s')
    root.style.setProperty('--theme-transition-timing', 'cubic-bezier(0.4, 0, 0.2, 1)')
    
    // Apply theme class
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('studio')
    } else if (theme === 'studio') {
      root.classList.add('studio')
      root.classList.remove('dark')
    } else {
      root.classList.remove('dark', 'studio')
    }
  }, [theme])

  return null
}