"use client"

import { useEffect, useState } from 'react'

export function useThemeDetection() {
  const [isAutoMode, setIsAutoMode] = useState(true)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')
  const [timeBasedTheme, setTimeBasedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Detect system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    // Detect time-based theme
    const updateTimeBasedTheme = () => {
      const hour = new Date().getHours()
      setTimeBasedTheme(hour >= 6 && hour < 18 ? 'light' : 'dark')
    }

    updateTimeBasedTheme()
    const interval = setInterval(updateTimeBasedTheme, 60000) // Update every minute

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      clearInterval(interval)
    }
  }, [])

  const getAutoTheme = () => {
    // Use time-based theme during business hours, system theme otherwise
    const hour = new Date().getHours()
    return (hour >= 6 && hour < 18) ? timeBasedTheme : systemTheme
  }

  return {
    isAutoMode,
    systemTheme,
    timeBasedTheme,
    autoTheme: getAutoTheme(),
    setIsAutoMode
  }
}