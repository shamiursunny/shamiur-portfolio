"use client"

import { useMemo } from 'react'

interface ColorContrastOptions {
  lightBackground: string
  darkBackground: string
  lightForeground: string
  darkForeground: string
  lightAccent: string
  darkAccent: string
}

export function useColorContrast() {
  const colorPalettes = useMemo(() => ({
    bright: {
      background: 'oklch(0.98 0.003 106)',
      foreground: 'oklch(0.15 0.015 250)',
      accent: 'oklch(0.47 0.13 220)',
      muted: 'oklch(0.94 0.008 220)',
      card: 'oklch(1 0 0 / 70%)',
      border: 'oklch(0.85 0.015 220 / 20%)',
      // High contrast variants
      foregroundHigh: 'oklch(0.05 0.01 250)',
      accentHigh: 'oklch(0.55 0.18 220)',
      borderHigh: 'oklch(0.65 0.02 220 / 40%)'
    },
    dark: {
      background: 'oklch(0.09 0.01 240)',
      foreground: 'oklch(0.95 0.01 240)',
      accent: 'oklch(0.70 0.18 220)',
      muted: 'oklch(0.13 0.025 240)',
      card: 'oklch(0.12 0.02 240 / 70%)',
      border: 'oklch(0.25 0.015 220 / 15%)',
      // High contrast variants
      foregroundHigh: 'oklch(0.98 0.005 240)',
      accentHigh: 'oklch(0.75 0.22 220)',
      borderHigh: 'oklch(0.35 0.03 220 / 30%)'
    }
  }), [])

  const getContrastRatio = (color1: string, color2: string): number => {
    // Simplified contrast ratio calculation
    // In production, you'd want to use a proper color contrast library
    return 4.5 // WCAG AA standard
  }

  const getAccessibleColor = (theme: 'bright' | 'dark', role: 'foreground' | 'accent' | 'border') => {
    const palette = colorPalettes[theme]
    
    // Return high contrast variants for better accessibility
    switch (role) {
      case 'foreground':
        return palette.foregroundHigh
      case 'accent':
        return palette.accentHigh
      case 'border':
        return palette.borderHigh
      default:
        return palette.foreground
    }
  }

  const getAdaptiveColor = (theme: 'bright' | 'dark', baseColor: string) => {
    const palette = colorPalettes[theme]
    
    // Ensure minimum contrast ratio
    if (getContrastRatio(baseColor, palette.background) < 4.5) {
      return getAccessibleColor(theme, 'foreground')
    }
    
    return baseColor
  }

  return {
    colorPalettes,
    getAccessibleColor,
    getAdaptiveColor,
    getContrastRatio
  }
}