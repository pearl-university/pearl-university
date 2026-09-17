import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import defaultHeroImg from '../../assets/images/home/img1.png'
import { CountUpNumber } from '../common/CountUpNumber'

export interface StatItem {
  value: number
  label: string
  suffix?: string
}

const DEFAULT_STATS: StatItem[] = [
  { value: 3, label: 'Faculties' },
  { value: 11, label: 'Programmes' },
  { value: 4, label: 'Research Areas' },
  { value: 2, label: 'Campus Locations' },
]

export interface HeroSectionProps {
  backgroundImage?: string
  alt?: string
  title?: ReactNode
  description?: string
  stats?: StatItem[]
  ctaText?: string
  ctaLink?: string
}

export const HeroSection: FC<HeroSectionProps> = ({
  backgroundImage = defaultHeroImg,
  alt = 'Pearl University Campus',
  title = (
    <>
      Welcome To
      <br className="hidden sm:inline" />{' '}
      Pearl University
    </>
  ),
  description = 'Welcome to Pearl University, an academic community dedicated to building value through rigorous learning, purposeful innovation, and a commitment to developing graduates equipped to contribute meaningfully to society, industry, and the future.',
  stats = DEFAULT_STATS,
  ctaText = 'Explore →',
  ctaLink = '/academics',
}) => {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden">
      {/* Background Image & Overlay with smooth scale */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          key={backgroundImage}
          initial={{ scale: 1.12, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          src={backgroundImage}
          alt={alt}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Dark gradient for high contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/40" />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Hero Content with masked text lines */}
      <div className="relative z-10 w-full px-5 sm:px-8 md:px-10 lg:px-14 pt-28 sm:pt-32 md:pt-36 lg:pt-44 pb-14 sm:pb-18 md:pb-20 max-w-6xl">
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
          {/* Main Headline with masked slide-up */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[38px] xs:text-[44px] sm:text-[54px] md:text-6xl lg:text-[80px] xl:text-[92px] 2xl:text-[98px] font-heading font-medium leading-[1.08] sm:leading-[1.1] md:leading-[1.12] lg:leading-[1.06] xl:leading-[1.04] text-white tracking-[-0.025em] drop-shadow-md"
            >
              {title}
            </motion.h1>
          </div>

          {/* Mission Paragraph with fade-in-up */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/95 text-base sm:text-lg md:text-[19px] leading-relaxed max-w-2xl font-normal drop-shadow-sm"
          >
            {description}
          </motion.p>
        </div>
      </div>

      {/* Bottom Stats & Explore Bar */}
      <div className="relative z-10 w-full mt-auto">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 w-full border-t border-white/10"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ backgroundColor: 'rgba(24, 27, 22, 0.95)' }}
              className={`bg-[#181b16]/85 backdrop-blur-md px-6 py-6 md:py-8 lg:py-10 flex flex-col justify-center border-r border-white/15 transition-colors ${index === 1 ? 'border-r-0 lg:border-r' : ''
                } ${index === 2 ? 'border-t lg:border-t-0' : ''} ${index === 3 ? 'border-t lg:border-t-0' : ''
                }`}
            >
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-none">
                <CountUpNumber target={stat.value} duration={1.5} suffix={stat.suffix} />
              </span>
              <span className="text-xs sm:text-sm md:text-base font-normal text-white/90 mt-2">
                {stat.label}
              </span>
            </motion.div>
          ))}

          {/* Explore CTA Box */}
          <Link
            to={ctaLink}
            className="col-span-2 sm:col-span-2 lg:col-span-1 bg-white text-black hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 px-8 py-6 md:py-8 lg:py-10 flex items-center justify-center group focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-900 cursor-pointer"
          >
            <span className="font-[500] text-xl sm:text-2xl md:text-[26px] tracking-tight group-hover:translate-x-1.5 transition-transform duration-200">
              {ctaText}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

