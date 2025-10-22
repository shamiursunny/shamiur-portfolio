"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ResponsiveTextProps {
  children: React.ReactNode
  variant?: "hero" | "heading" | "subheading" | "body" | "caption"
  className?: string
  gradient?: boolean
  as?: keyof JSX.IntrinsicElements
}

const typographyVariants = {
  hero: {
    base: "font-bold leading-tight",
    sizes: {
      xs: "text-3xl",
      sm: "text-4xl",
      md: "text-5xl",
      lg: "text-6xl",
      xl: "text-7xl",
      "2xl": "text-8xl",
    },
    spacing: {
      xs: "tracking-tight",
      sm: "tracking-tight",
      md: "tracking-tight",
      lg: "tracking-tighter",
      xl: "tracking-tighter",
      "2xl": "tracking-tighter",
    }
  },
  heading: {
    base: "font-semibold leading-tight",
    sizes: {
      xs: "text-xl",
      sm: "text-2xl",
      md: "text-3xl",
      lg: "text-4xl",
      xl: "text-5xl",
      "2xl": "text-6xl",
    },
    spacing: {
      xs: "tracking-normal",
      sm: "tracking-tight",
      md: "tracking-tight",
      lg: "tracking-tight",
      xl: "tracking-tighter",
      "2xl": "tracking-tighter",
    }
  },
  subheading: {
    base: "font-medium leading-relaxed",
    sizes: {
      xs: "text-base",
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
      "2xl": "text-4xl",
    },
    spacing: {
      xs: "tracking-normal",
      sm: "tracking-normal",
      md: "tracking-normal",
      lg: "tracking-wide",
      xl: "tracking-wide",
      "2xl": "tracking-wider",
    }
  },
  body: {
    base: "font-normal leading-relaxed",
    sizes: {
      xs: "text-sm",
      sm: "text-base",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
      "2xl": "text-3xl",
    },
    spacing: {
      xs: "tracking-normal",
      sm: "tracking-normal",
      md: "tracking-normal",
      lg: "tracking-wide",
      xl: "tracking-wide",
      "2xl": "tracking-wider",
    }
  },
  caption: {
    base: "font-normal leading-relaxed",
    sizes: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    spacing: {
      xs: "tracking-wide",
      sm: "tracking-wide",
      md: "tracking-wide",
      lg: "tracking-wider",
      xl: "tracking-wider",
      "2xl": "tracking-widest",
    }
  }
}

export function ResponsiveText({ 
  children, 
  variant = "body", 
  className, 
  gradient = false,
  as: Component = "span"
}: ResponsiveTextProps) {
  const [viewportSize, setViewportSize] = useState("md")
  
  useEffect(() => {
    const updateViewportSize = () => {
      const width = window.innerWidth
      if (width < 640) setViewportSize("xs")
      else if (width < 768) setViewportSize("sm")
      else if (width < 1024) setViewportSize("md")
      else if (width < 1280) setViewportSize("lg")
      else if (width < 1536) setViewportSize("xl")
      else setViewportSize("2xl")
    }
    
    updateViewportSize()
    window.addEventListener("resize", updateViewportSize)
    return () => window.removeEventListener("resize", updateViewportSize)
  }, [])
  
  const variantConfig = typographyVariants[variant]
  const sizeClass = variantConfig.sizes[viewportSize as keyof typeof variantConfig.sizes]
  const spacingClass = variantConfig.spacing[viewportSize as keyof typeof variantConfig.spacing]
  
  const gradientClasses = gradient
    ? "bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
    : ""
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        variantConfig.base,
        sizeClass,
        spacingClass,
        gradientClasses,
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      <Component>{children}</Component>
    </motion.div>
  )
}

// Hook for responsive spacing
export function useResponsiveSpacing() {
  const [spacing, setSpacing] = useState({
    section: "py-16",
    container: "px-4",
    gap: "gap-6",
    card: "p-6"
  })
  
  useEffect(() => {
    const updateSpacing = () => {
      const width = window.innerWidth
      if (width < 640) {
        setSpacing({
          section: "py-8",
          container: "px-4",
          gap: "gap-4",
          card: "p-4"
        })
      } else if (width < 768) {
        setSpacing({
          section: "py-12",
          container: "px-6",
          gap: "gap-6",
          card: "p-6"
        })
      } else if (width < 1024) {
        setSpacing({
          section: "py-16",
          container: "px-8",
          gap: "gap-8",
          card: "p-8"
        })
      } else {
        setSpacing({
          section: "py-24",
          container: "px-8",
          gap: "gap-12",
          card: "p-8"
        })
      }
    }
    
    updateSpacing()
    window.addEventListener("resize", updateSpacing)
    return () => window.removeEventListener("resize", updateSpacing)
  }, [])
  
  return spacing
}