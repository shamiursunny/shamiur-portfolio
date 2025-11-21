"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMouseParallax } from '@/hooks/use-parallax'

interface MouseParallaxProps {
  children: React.ReactNode
  strength?: number
  dampening?: number
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export function MouseParallax({
  children,
  strength = 20,
  dampening = 0.1,
  className,
  as: Component = 'div'
}: MouseParallaxProps) {
  const { ref, mousePosition } = useMouseParallax({ strength, dampening })

  const MotionComponent = motion[Component] as any

  return (
    <MotionComponent
      ref={ref}
      style={{
        x: mousePosition.x,
        y: mousePosition.y,
        transformStyle: 'preserve-3d'
      }}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  )
}