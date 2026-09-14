import type { FC, ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export interface SlantedScrollCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  variant?: 'default' | 'portrait'
}

/**
 * Reusable 3D Slant Scroll Card component:
 * - 'default': Balanced 3D tilt for landscape/square cards
 * - 'portrait': Significantly smaller X-axis pitch with pronounced Y & Z rotations tailored for tall portrait cards
 */
export const SlantedScrollCard: FC<SlantedScrollCardProps> = ({
  children,
  className = '',
  intensity = 1,
  variant = 'default',
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })

  // Portrait variant keeps X-axis rotation subtle so tall cards don't over-pitch, while amplifying Y and Z rotations
  const isPortrait = variant === 'portrait'

  const xEntrance = isPortrait ? 2.5 : 9
  const xExit = isPortrait ? -2 : -7

  const yEntrance = isPortrait ? -10 : -6
  const yExit = isPortrait ? 8 : 5

  const zEntrance = isPortrait ? 3.5 : 2
  const zExit = isPortrait ? -3.5 : -2

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.32, 0.68, 1],
    [xEntrance * intensity, 0, 0, xExit * intensity]
  )
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.32, 0.68, 1],
    [yEntrance * intensity, 0, 0, yExit * intensity]
  )
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 0.32, 0.68, 1],
    [zEntrance * intensity, 0, 0, zExit * intensity]
  )
  const scale = useTransform(
    scrollYProgress,
    [0, 0.32, 0.68, 1],
    [0.95, 1, 1, 0.96]
  )
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.82, 1, 1, 0.82]
  )

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        rotateZ,
        scale,
        opacity,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  )
}
