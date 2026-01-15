'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ScrollTransitionSectionProps {
  children: React.ReactNode
  background?: string
}

export default function ScrollTransitionSection({
  children,
}: ScrollTransitionSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Smooth fade and scale as the user scrolls through the section
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])

  return (
    <section
      ref={ref}
      className="min-h-screen flex justify-center items-center relative overflow-hidden"
    >
      <motion.div
        style={{ opacity, scale, y }}
        className="w-full h-full flex justify-center items-center"
      >
        {children}
      </motion.div>
    </section>
  )
}
