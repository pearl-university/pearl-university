import type { FC } from 'react'
import { useState, useRef, useEffect } from 'react'
import type { MotionValue } from 'framer-motion'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { fadeInUp } from '../../utils/motion'

export interface Program {
  id: string
  title: string
  faculty: string
  isDark?: boolean
}

const PROGRAMS: Program[] = [
  {
    id: 'cs',
    title: 'Computer Science',
    faculty: '/Faculty of Computing',
    isDark: true,
  },
  {
    id: 'hca',
    title: 'Health Care Administration and Hospital Management',
    faculty: '/Faculty of Allied and Health Sciences',
  },
  {
    id: 'crim',
    title: 'Criminology, Security and Conflict Studies',
    faculty: 'Faculty of Management and Social Sciences',
  },
  {
    id: 'cyber',
    title: 'Cyber Security',
    faculty: '/Faculty of Computing',
  },
  {
    id: 'se',
    title: 'Software Engineering',
    faculty: '/Faculty of Computing',
  },
  {
    id: 'ph',
    title: 'Public Health',
    faculty: '/Faculty of Allied and Health Sciences',
  },
]

interface ProgramCardProps {
  program: Program
  index: number
  x: MotionValue<number>
  cardWidth: number
  gap: number
}

const ProgramCard: FC<ProgramCardProps> = ({ program, index, x, cardWidth, gap }) => {
  const isDark = index === 0 || program.isDark
  const step = cardWidth + gap
  const centerTarget = -index * step

  // 3D Slant (X, Y, Z axes): Slanted on entrance, straightens in view center, slants on exit
  const rotateY = useTransform(
    x,
    [centerTarget - 700, centerTarget, centerTarget + 700],
    [14, 0, -16]
  )
  const rotateX = useTransform(
    x,
    [centerTarget - 700, centerTarget, centerTarget + 700],
    [-6, 0, 8]
  )
  const rotateZ = useTransform(
    x,
    [centerTarget - 700, centerTarget, centerTarget + 700],
    [2.5, 0, -3.5]
  )
  const scale = useTransform(
    x,
    [centerTarget - 700, centerTarget, centerTarget + 700],
    [0.93, 1, 0.93]
  )
  const cardOpacity = useTransform(
    x,
    [centerTarget - 900, centerTarget - 700, centerTarget, centerTarget + 700, centerTarget + 900],
    [0.6, 0.9, 1, 0.9, 0.6]
  )

  return (
    <motion.div
      style={{
        rotateY,
        rotateX,
        rotateZ,
        scale,
        opacity: cardOpacity,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className={`flex-shrink-0 w-[290px] sm:w-[350px] md:w-[400px] min-h-[240px] sm:min-h-[270px] md:min-h-[290px] rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-colors duration-200 group cursor-pointer will-change-transform ${
        isDark
          ? 'bg-[#141416] text-white shadow-xl shadow-black/10'
          : 'bg-transparent border border-black/30 text-black hover:border-black/60 hover:bg-black/[0.02]'
      }`}
    >
      {/* Program Title */}
      <h4
        className={`text-lg sm:text-xl md:text-[23px] font-normal leading-snug tracking-tight ${
          isDark ? 'text-white' : 'text-black'
        }`}
      >
        {program.title}
      </h4>

      {/* Bottom Faculty Tag & Arrow */}
      <div className="flex items-center justify-between gap-3 mt-8 sm:mt-10">
        <span
          className={`inline-flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-normal border transition-colors ${
            isDark
              ? 'border-white/30 text-white/90 group-hover:border-white/60'
              : 'border-black/40 text-black/90 group-hover:border-black/70'
          }`}
        >
          {program.faculty}
        </span>

        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 shrink-0 ${
            isDark
              ? 'border-white/30 text-white group-hover:bg-white group-hover:text-black'
              : 'border-black/40 text-black group-hover:bg-black group-hover:text-white'
          }`}
        >
          <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.div>
  )
}

interface ViewMoreCardProps {
  index: number
  x: MotionValue<number>
  cardWidth: number
  gap: number
}

const ViewMoreCard: FC<ViewMoreCardProps> = ({ index, x, cardWidth, gap }) => {
  const step = cardWidth + gap
  const centerTarget = -index * step

  const rotateY = useTransform(
    x,
    [centerTarget - 700, centerTarget, centerTarget + 700],
    [14, 0, -16]
  )
  const rotateX = useTransform(
    x,
    [centerTarget - 700, centerTarget, centerTarget + 700],
    [-6, 0, 8]
  )
  const rotateZ = useTransform(
    x,
    [centerTarget - 700, centerTarget, centerTarget + 700],
    [2.5, 0, -3.5]
  )
  const scale = useTransform(
    x,
    [centerTarget - 700, centerTarget, centerTarget + 700],
    [0.93, 1, 0.93]
  )

  return (
    <motion.div
      style={{
        rotateY,
        rotateX,
        rotateZ,
        scale,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className="flex-shrink-0 w-[290px] sm:w-[350px] md:w-[400px] min-h-[240px] sm:min-h-[270px] md:min-h-[290px] rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col justify-between bg-black text-white shadow-xl shadow-black/15 border border-black group cursor-pointer will-change-transform"
    >
      <div className="flex flex-col">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#FDE88C]">
          Curriculum & Degrees
        </span>
        <h4 className="text-xl sm:text-2xl md:text-[25px] font-heading font-normal text-white mt-3 leading-snug">
          Explore All 25+ Programs
        </h4>
        <p className="text-xs sm:text-sm text-gray-300 mt-2.5 leading-relaxed">
          Discover comprehensive undergraduate disciplines and curriculum outlines tailored for modern global careers.
        </p>
      </div>

      <Link
        to="/academics"
        className="inline-flex items-center justify-between gap-3 text-sm font-medium text-black bg-[#FDE88C] px-5 py-3 rounded-full hover:bg-white transition-all duration-300 mt-6"
      >
        <span>View Full Catalog</span>
        <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </motion.div>
  )
}

export const AcademicProgramsSection: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState<number>(0)

  // Slower, smoother horizontal parallax by giving generous scroll runway
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Measure dynamic horizontal travel length
  useEffect(() => {
    const calculateDistance = () => {
      if (trackRef.current) {
        const totalWidth = trackRef.current.scrollWidth
        const viewportWidth = window.innerWidth
        const rightBuffer = window.innerWidth < 640 ? 40 : 120
        setScrollDistance(Math.max(0, totalWidth - viewportWidth + rightBuffer))
      }
    }

    calculateDistance()
    const timer = setTimeout(calculateDistance, 200)
    window.addEventListener('resize', calculateDistance)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateDistance)
    }
  }, [])

  // GPU Transform tied directly to vertical scroll progression (butter smooth)
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance])

  const scrollByStep = (direction: 'left' | 'right') => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const currentScrollY = window.scrollY
    const sectionTop = currentScrollY + rect.top
    const sectionHeight = sectionRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const totalScrollable = Math.max(0, sectionHeight - viewportHeight)

    const stepFraction = 0.18
    const currentProgress = totalScrollable > 0 ? Math.min(1, Math.max(0, -rect.top / totalScrollable)) : 0
    const nextProgress = direction === 'left'
      ? Math.max(0, currentProgress - stepFraction)
      : Math.min(1, currentProgress + stepFraction)

    window.scrollTo({
      top: sectionTop + nextProgress * totalScrollable,
      behavior: 'smooth',
    })
  }

  const cardWidth = 380
  const gap = 24

  return (
    <section
      ref={sectionRef}
      id="academic-programs-section"
      data-hide-nav="true"
      className="relative w-full h-[260vh] bg-[#FDE88C]"
    >
      {/* Pinned Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 overflow-hidden bg-[#FDE88C]">
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center h-full max-h-[860px]">
          {/* Top Header */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="max-w-4xl flex flex-col mb-6 sm:mb-8 md:mb-10 shrink-0"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-black tracking-[-0.01em] leading-tight">
              Academic Programs
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-[17px] text-black/90 max-w-2xl leading-relaxed font-normal">
              Explore thoughtfully designed programmes that combine academic depth,
              practical learning, and contemporary knowledge to prepare students for
              meaningful careers and lifelong contribution.
            </p>
          </motion.div>

          {/* Subheading & Controls */}
          <div className="flex items-center justify-between mb-6 md:mb-7 shrink-0">
            <h3 className="text-xl sm:text-2xl md:text-[28px] font-normal text-black font-heading tracking-tight">
              /Bachelors
            </h3>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => scrollByStep('left')}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border border-black/70 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer text-black hover:bg-black/10 active:scale-90 hover:scale-105"
                aria-label="Scroll backward in academic programs"
              >
                <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollByStep('right')}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer bg-black text-white hover:bg-black/85 active:scale-90 hover:scale-105 shadow-xs"
                aria-label="Scroll forward in academic programs"
              >
                <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Continuous GPU-Accelerated Parallax Track with 3D Slant Perspective */}
          <div
            className="w-full relative overflow-visible flex-1 min-h-0 flex items-center"
            style={{ perspective: 1200 }}
          >
            <motion.div
              ref={trackRef}
              style={{ x, transformStyle: 'preserve-3d' }}
              className="flex items-stretch gap-5 sm:gap-6 md:gap-7 will-change-transform py-4"
            >
              {PROGRAMS.map((program, index) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  index={index}
                  x={x}
                  cardWidth={cardWidth}
                  gap={gap}
                />
              ))}

              {/* View More End Card */}
              <ViewMoreCard
                index={PROGRAMS.length}
                x={x}
                cardWidth={cardWidth}
                gap={gap}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
