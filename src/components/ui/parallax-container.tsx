"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ParallaxContainerProps {
  children: ReactNode
  className?: string
  speed?: number
  offset?: [number, number]
  enableScale?: boolean
}

export function ParallaxContainer({ 
  children, 
  className, 
  speed = 0.5,
  offset = ["start end", "end start"],
  enableScale = false
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as [string, string]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 300])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  const springY = useSpring(y, { stiffness: 100, damping: 20 })
  const springScale = useSpring(scale, { stiffness: 100, damping: 20 })
  
  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        style={{
          y: springY,
          scale: enableScale ? springScale : 1,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
  intensity?: number
}

export function FloatingElement({ 
  children, 
  className, 
  duration = 3,
  delay = 0,
  intensity = 10
}: FloatingElementProps) {
  return (
    <motion.div
      className={cn("will-change-transform", className)}
      animate={{
        y: [0, -intensity, 0],
        rotateZ: [-1, 1, -1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  )
}