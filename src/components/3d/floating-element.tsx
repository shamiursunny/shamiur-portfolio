"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MouseParallax } from './mouse-parallax'

interface FloatingElementProps {
  children: React.ReactNode
  duration?: number
  intensity?: number
  className?: string
  delay?: number
  interactive?: boolean
}

export function FloatingElement({
  children,
  duration = 6,
  intensity = 10,
  className,
  delay = 0,
  interactive = true
}: FloatingElementProps) {
  const floatAnimation = {
    y: [0, -intensity, 0, intensity, 0],
    rotate: [0, 2, 0, -2, 0],
  }

  const Content = (
    <motion.div
      className={cn("relative", className)}
      animate={floatAnimation}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        delay
      }}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  )

  if (interactive) {
    return (
      <MouseParallax strength={intensity / 2}>
        {Content}
      </MouseParallax>
    )
  }

  return Content
}