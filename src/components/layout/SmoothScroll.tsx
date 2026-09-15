import type { FC, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProps {
  children: ReactNode
}

declare global {
  interface Window {
    lenisApp?: Lenis
  }
}

export const SmoothScroll: FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Ultra-smooth liquid Lenis instance with continuous 4th-order easeOut and no micro-jumps
    const lenis = new Lenis({
      duration: 1.1,
      // Continuous Quartic easeOut with exact 0 starting derivative and exact 0 ending velocity
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95, // Dampened wheel multiplier prevents sudden large delta leaps
      touchMultiplier: 1.2,
      syncTouch: false,
    })

    lenisRef.current = lenis
    window.lenisApp = lenis

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.lenisApp = undefined
    }
  }, [])

  return <>{children}</>
}
