import type { FC } from 'react'

interface MarqueeTickerProps {
  items?: string[]
}

const DEFAULT_ITEMS = [
  'KNOWLEDGE & EXCELLENCE',
  'PURPOSEFUL INNOVATION',
  'GLOBAL RESEARCH IMPACT',
  'TRANSFORMATIVE LEADERSHIP',
  'CHARACTER & INTEGRITY',
  'CUTTING-EDGE FACULTIES',
]

export const MarqueeTicker: FC<MarqueeTickerProps> = ({
  items = DEFAULT_ITEMS,
}) => {
  return (
    <div className="w-full bg-[#141416] text-[#FDE88C] py-4 sm:py-5 overflow-hidden border-y border-white/10 select-none">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="font-heading text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
              {item}
            </span>
            <span className="text-[#FDE88C]/60 text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  )
}
