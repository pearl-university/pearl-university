import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface CountUpNumberProps {
  target: number
  duration?: number
  suffix?: string
}

export const CountUpNumber: FC<CountUpNumberProps> = ({
  target,
  duration = 1.6,
  suffix = '',
}) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = target
    const totalSteps = 60 * duration
    const stepIncrement = end / totalSteps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      start += stepIncrement
      if (currentStep >= totalSteps || start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}
