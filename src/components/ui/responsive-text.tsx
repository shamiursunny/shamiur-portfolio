"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { useResponsiveTypography } from "@/hooks/use-responsive-typography"

interface ResponsiveTextProps {
  variant?: "hero" | "heading" | "subheading" | "body" | "caption"
  gradient?: boolean
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  children: React.ReactNode
}

export function ResponsiveText({
  variant = "body",
  gradient = false,
  className,
  as: Component = "div",
  children,
}: ResponsiveTextProps) {
  const fontSize = useResponsiveTypography()

  const baseClasses = "font-bold text-gradient bg-clip-text text-transparent"
  const variantClasses = {
    hero: "text-6xl md:text-8xl lg:text-9xl",
    heading: "text-4xl md:text-6xl lg:text-7xl",
    subheading: "text-2xl md:text-3xl lg:text-4xl",
    body: "text-lg md:text-xl lg:text-2xl",
    caption: "text-sm md:text-base lg:text-lg"
  }

  const gradientClasses = gradient
    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
    : "bg-gradient-to-r from-blue-400 to-purple-400"

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${gradientClasses} ${className || ""}`}
      style={{ fontSize }}
    >
      <Component className="inline">{children}</Component>
    </motion.div>
  )
}

export function useResponsiveSpacing() {
  return { container: "px-4 sm:px-6 lg:px-8", section: "py-12 sm:py-16 lg:py-20", gap: "gap-4 sm:gap-6 lg:gap-8" }
}