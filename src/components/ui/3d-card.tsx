"use client"

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface Card3DProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  enableGlow?: boolean
  glassEffect?: boolean
}

export function Card3D({ 
  children, 
  className, 
  intensity = 0.15,
  enableGlow = true,
  glassEffect = true 
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-100, 100], [intensity * 20, -intensity * 20])
  const rotateY = useTransform(x, [-100, 100], [-intensity * 20, intensity * 20])
  
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })
  
  const glowX = useTransform(x, [-100, 100], [-50, 50])
  const glowY = useTransform(y, [-100, 100], [-50, 50])
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }
  
  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative transform-gpu transition-all duration-300",
        glassEffect && "backdrop-blur-xl bg-white/10 dark:bg-black/20",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, z: 50 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Glassmorphism border effect */}
      {glassEffect && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-white/5 dark:from-white/10 dark:to-transparent pointer-events-none" />
      )}
      
      {/* Dynamic glow effect */}
      {enableGlow && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + glowX.get()}% ${50 + glowY.get()}%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`,
          }}
        />
      )}
      
      {/* Depth shadow */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-black/20 dark:bg-black/40 blur-xl"
        style={{
          transform: "translateZ(-50px) translateY(10px)",
          opacity: isHovered ? 0.3 : 0.1,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 transform-gpu">
        {children}
      </div>
    </motion.div>
  )
}