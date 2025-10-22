"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface ParallaxOptions {
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  spring?: boolean
}

export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up', spring = true } = options
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const transforms = {
    up: useTransform(scrollYProgress, [0, 1], [0, speed * 100]),
    down: useTransform(scrollYProgress, [0, 1], [0, -speed * 100]),
    left: useTransform(scrollYProgress, [0, 1], [0, speed * 100]),
    right: useTransform(scrollYProgress, [0, 1], [0, -speed * 100])
  }

  const transform = transforms[direction]
  const springTransform = useSpring(transform, { stiffness: 100, damping: 30 })

  return { ref, transform: spring ? springTransform : transform }
}

interface MouseParallaxOptions {
  strength?: number
  dampening?: number
}

export function useMouseParallax(options: MouseParallaxOptions = {}) {
  const { strength = 20, dampening = 0.1 } = options
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) / rect.width
      const deltaY = (e.clientY - centerY) / rect.height

      setMousePosition({
        x: deltaX * strength,
        y: deltaY * strength
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [strength])

  return { ref, mousePosition }
}