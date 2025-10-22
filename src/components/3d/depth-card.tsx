"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MouseParallax } from './mouse-parallax'

interface DepthCardProps {
  children: React.ReactNode
  className?: string
  depth?: 'subtle' | 'medium' | 'deep'
  interactive?: boolean
  as?: keyof JSX.IntrinsicElements
}

const depthShadows = {
  subtle: {
    light: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    dark: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
  },
  medium: {
    light: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    dark: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
  },
  deep: {
    light: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    dark: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)'
  }
}

export function DepthCard({
  children,
  className,
  depth = 'medium',
  interactive = true,
  as: Component = 'div'
}: DepthCardProps) {
  const MotionComponent = motion[Component] as any

  const CardContent = (
    <MotionComponent
      className={cn(
        'relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-6 transition-all duration-300',
        'hover:shadow-2xl hover:scale-[1.02] hover:bg-card/90',
        'dark:bg-card/60 dark:border-border/20',
        interactive && 'cursor-pointer',
        className
      )}
      style={{
        boxShadow: depthShadows[depth].light,
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
      }}
      whileHover={interactive ? {
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
        transition: { duration: 0.3, ease: 'easeOut' }
      } : undefined}
      whileTap={interactive ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
    >
      {/* Glassmorphism layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent rounded-2xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </MotionComponent>
  )

  if (interactive) {
    return (
      <MouseParallax strength={15} className="w-full">
        {CardContent}
      </MouseParallax>
    )
  }

  return CardContent
}