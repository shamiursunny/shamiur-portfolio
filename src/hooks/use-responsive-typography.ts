"use client"

import { useEffect, useState } from 'react'

interface ResponsiveTypographyOptions {
  minFontSize?: number
  maxFontSize?: number
  minViewport?: number
  maxViewport?: number
  unit?: string
}

export function useResponsiveTypography(options: ResponsiveTypographyOptions = {}) {
  const {
    minFontSize = 16,
    maxFontSize = 24,
    minViewport = 320,
    maxViewport = 1920,
    unit = 'px'
  } = options

  const [fontSize, setFontSize] = useState(`${minFontSize}${unit}`)

  useEffect(() => {
    const calculateFontSize = () => {
      const viewportWidth = window.innerWidth
      
      // Clamp viewport width between min and max
      const clampedViewport = Math.min(Math.max(viewportWidth, minViewport), maxViewport)
      
      // Calculate the ratio (0 to 1)
      const ratio = (clampedViewport - minViewport) / (maxViewport - minViewport)
      
      // Calculate font size based on ratio
      const calculatedSize = minFontSize + (maxFontSize - minFontSize) * ratio
      
      setFontSize(`${calculatedSize}${unit}`)
    }

    calculateFontSize()
    window.addEventListener('resize', calculateFontSize)
    
    return () => window.removeEventListener('resize', calculateFontSize)
  }, [minFontSize, maxFontSize, minViewport, maxViewport, unit])

  return fontSize
}

export function useFluidSpacing() {
  const [spacingScale, setSpacingScale] = useState(1)

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth
      const baseWidth = 1440 // Design system base width
      
      // Scale between 0.8 and 1.2 based on viewport
      const scale = Math.min(Math.max(viewportWidth / baseWidth, 0.8), 1.2)
      setSpacingScale(scale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  return spacingScale
}