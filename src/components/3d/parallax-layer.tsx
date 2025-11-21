"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useParallax } from '@/hooks/use-parallax'

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  spring?: boolean
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = 'up',
  className,
  as: Component = 'div',
  spring = true
}: ParallaxLayerProps) {
  const { ref, transform } = useParallax({ speed, direction, spring })

  const MotionComponent = motion[Component] as any

  return (
    <MotionComponent
      ref={ref}
      style={{
        [direction === 'up' || direction === 'down' ? 'y' : 'x']: transform
      }}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  )
}