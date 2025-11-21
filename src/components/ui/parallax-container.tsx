"use client"

import { ForwardedRef, forwardRef, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParallaxContainerProps {
  children: React.ReactNode
  speed?: number
  offset?: [number, number]
  enableScale?: boolean
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

const ParallaxContainer = forwardRef(
  (
    {
      children,
      speed = 0.5,
      offset = [0, 1],
      enableScale = false,
      className,
      as: Component = 'div'
    }: ParallaxContainerProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const containerRef = ref || useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: offset as [number, number]
    })

    const y = useTransform(
      scrollYProgress,
      [0, 1],
      [0, speed * 100]
    )

    const MotionComponent = motion[Component] as React.ComponentType<any>

    return (
      <MotionComponent
        ref={containerRef}
        style={{ y }}
        className={cn(className)}
      >
        {children}
      </MotionComponent>
    )
  }
)

ParallaxContainer.displayName = "ParallaxContainer"

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
      <motion.div className="w-full">
        {Content}
      </motion.div>
    )
  }

  return Content
}

export { ParallaxContainer }