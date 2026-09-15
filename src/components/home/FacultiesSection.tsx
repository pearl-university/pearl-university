import type { FC } from 'react'
import { useState, useRef, useEffect } from 'react'
import type { Variants, MotionValue } from 'framer-motion'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion'
import { HiChevronDown } from 'react-icons/hi2'
import img2 from '../../assets/images/home/img2.webp'
import img3 from '../../assets/images/home/img3.webp'
import img4 from '../../assets/images/home/img4.webp'
import img5 from '../../assets/images/home/img5.webp'
import img6 from '../../assets/images/home/img6.webp'
import img7 from '../../assets/images/home/img7.webp'
import img9 from '../../assets/images/home/img9.webp'
import img11 from '../../assets/images/home/img11.webp'
import img12 from '../../assets/images/home/img12.webp'
import { fadeInUp } from '../../utils/motion'

interface Faculty {
  id: string
  title: string
  description: string
  images: {
    src: string
    alt: string
  }[]
}

const FACULTIES: Faculty[] = [
  {
    id: 'computing',
    title: 'Faculty of Computing',
    description:
      'Through the faculty of Computing, the Faculty offers Computer Science, Cyber Security, Software Engineering and Data Science, preparing students for a technology-driven world.',
    images: [
      { src: img2, alt: 'Student studying in modern computing library' },
      { src: img3, alt: 'Students collaborating outdoors with laptops' },
      { src: img4, alt: 'Student smiling in active lecture hall' },
    ],
  },
  {
    id: 'health',
    title: 'Faculty of Allied and Health Sciences',
    description:
      'The Faculty brings together Public Health, Health Information System, and Health Care Administration and Hospital Management, preparing students to strengthen health systems and improve lives.',
    images: [
      { src: img6, alt: 'Health science laboratory and clinical training' },
      { src: img12, alt: 'Medical research and advanced healthcare practicals' },
      { src: img5, alt: 'Collaborative healthcare workshop and study session' },
    ],
  },
  {
    id: 'management',
    title: 'Faculty of Management and Social Sciences',
    description:
      'With departments in Accounting & Finance, Criminology, Security & Conflict Studies, Economics, and Business Administration, the Faculty develops analytical thinkers and responsible leaders.',
    images: [
      { src: img7, alt: 'Business and management executive seminar discussion' },
      { src: img9, alt: 'Economics and social research debate team' },
      { src: img11, alt: 'Finance and corporate leadership collaborative hub' },
    ],
  },
]

// Mobile Animation Variants
const slantedImageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 55,
    y: 35,
    rotateX: 12,
    rotateY: -14,
    rotateZ: -3,
    scale: 0.92,
  },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 6,
    rotateY: -8,
    rotateZ: 1.5,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: index * 0.12,
      ease: [0.22, 1, 0.36, 1],
      opacity: {
        duration: 0.45,
        delay: index * 0.12 + 0.05,
      },
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    x: -45,
    y: -25,
    rotateX: -12,
    rotateY: 14,
    rotateZ: 3,
    scale: 0.92,
    transition: {
      duration: 0.35,
      delay: (2 - index) * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

interface DesktopMosaicSetProps {
  faculty: Faculty
  index: number
  progress: MotionValue<number>
}

const DesktopMosaicSet: FC<DesktopMosaicSetProps> = ({ faculty, index, progress }) => {
  // Discrete, non-overlapping ranges ensuring 0 ghosting between sets:
  // Faculty 0: active [0, 0.28], cleanly exits by 0.32, display 'none' at 0.325
  // Faculty 1: display 'grid' at 0.315, enters [0.32, 0.36], active [0.36, 0.62], cleanly exits by 0.66, display 'none' at 0.665
  // Faculty 2: display 'grid' at 0.655, enters [0.66, 0.70], active [0.70, 1.00]
  const ranges = [
    {
      progress: [0, 0.28, 0.32, 0.33],
      opacity: [1, 1, 0, 0],
      y: [0, 0, -45, -45],
      rotateX: [6, 6, -8, -8],
      rotateY: [-8, -8, 12, 12],
      scale: [1, 1, 0.92, 0.92],
    },
    {
      progress: [0.31, 0.32, 0.36, 0.62, 0.66, 0.67],
      opacity: [0, 0, 1, 1, 0, 0],
      y: [45, 45, 0, 0, -45, -45],
      rotateX: [16, 16, 6, 6, -8, -8],
      rotateY: [-18, -18, -8, -8, 12, 12],
      scale: [0.92, 0.92, 1, 1, 0.92, 0.92],
    },
    {
      progress: [0.65, 0.66, 0.70, 1],
      opacity: [0, 0, 1, 1],
      y: [45, 45, 0, 0],
      rotateX: [16, 16, 6, 6],
      rotateY: [-18, -18, -8, -8],
      scale: [0.92, 0.92, 1, 1],
    },
  ][index]

  const opacity = useTransform(progress, ranges.progress, ranges.opacity)
  const y = useTransform(progress, ranges.progress, ranges.y)
  const rotateX = useTransform(progress, ranges.progress, ranges.rotateX)
  const rotateY = useTransform(progress, ranges.progress, ranges.rotateY)
  const scale = useTransform(progress, ranges.progress, ranges.scale)

  const display = useTransform(progress, (latest: number) => {
    if (index === 0) return latest <= 0.325 ? 'grid' : 'none'
    if (index === 1) return latest > 0.315 && latest <= 0.665 ? 'grid' : 'none'
    if (index === 2) return latest > 0.655 ? 'grid' : 'none'
    return 'none'
  })

  const pointerEvents = useTransform(progress, (latest: number) => {
    if (index === 0 && latest <= 0.32) return 'auto'
    if (index === 1 && latest > 0.32 && latest <= 0.66) return 'auto'
    if (index === 2 && latest > 0.66) return 'auto'
    return 'none'
  })

  return (
    <motion.div
      style={{
        display,
        opacity,
        y,
        rotateX,
        rotateY,
        rotateZ: 1.5,
        scale,
        pointerEvents,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className="absolute inset-0 w-full h-full grid grid-cols-2 gap-3.5 sm:gap-4 md:gap-5 will-change-transform"
    >
      {/* Sub-column 1: Two stacked slanted images */}
      <div
        style={{ transformStyle: 'preserve-3d' }}
        className="flex flex-col gap-3.5 sm:gap-4 md:gap-5 justify-between h-full"
      >
        <div className="overflow-hidden rounded-xl md:rounded-2xl shadow-md h-[calc(50%-7px)] sm:h-[calc(50%-8px)] md:h-[calc(50%-10px)] bg-gray-100 group relative">
          <img
            src={faculty.images[0].src}
            alt={faculty.images[0].alt}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="eager"
          />
        </div>
        <div className="overflow-hidden rounded-xl md:rounded-2xl shadow-md h-[calc(50%-7px)] sm:h-[calc(50%-8px)] md:h-[calc(50%-10px)] bg-gray-100 group relative">
          <img
            src={faculty.images[1].src}
            alt={faculty.images[1].alt}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="eager"
          />
        </div>
      </div>

      {/* Sub-column 2: Tall single slanted image */}
      <div className="overflow-hidden rounded-xl md:rounded-2xl shadow-md h-full bg-gray-100 group relative">
        <img
          src={faculty.images[2].src}
          alt={faculty.images[2].alt}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="eager"
        />
      </div>
    </motion.div>
  )
}

export const FacultiesSection: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const [isPausedMobile, setIsPausedMobile] = useState<boolean>(false)

  // Track screen size for responsive switching
  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  // Desktop Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Spring smoothing filter: enforces a silky velocity ceiling on rapid scroll gestures with snappy responsiveness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 105,
    damping: 24,
    mass: 0.35,
    restDelta: 0.0001,
  })

  // Map smooth progress to active index on desktop
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (!isDesktop) return

    if (latest < 0.33) {
      if (activeIndex !== 0) setActiveIndex(0)
    } else if (latest < 0.66) {
      if (activeIndex !== 1) setActiveIndex(1)
    } else {
      if (activeIndex !== 2) setActiveIndex(2)
    }
  })

  // Mobile-only auto-cycling timer
  useEffect(() => {
    if (isDesktop || isPausedMobile) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FACULTIES.length)
    }, 4500)

    return () => clearInterval(interval)
  }, [isDesktop, isPausedMobile, activeIndex])

  // Click-to-Scroll anchor handler on desktop / direct select on mobile
  const handleFacultyClick = (index: number) => {
    if (!isDesktop) {
      setActiveIndex(index)
      return
    }

    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const currentScrollY = window.scrollY
    const sectionTop = currentScrollY + rect.top
    const sectionHeight = sectionRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const totalScrollable = Math.max(0, sectionHeight - viewportHeight)

    // Scroll targets for the 3 milestones with comfortable dwell centering
    const targetFractions = [0.08, 0.49, 0.85]
    const targetScrollY = sectionTop + targetFractions[index] * totalScrollable

    if (window.lenisApp) {
      window.lenisApp.scrollTo(targetScrollY, {
        duration: 0.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      })
    } else {
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      })
    }
  }

  const currentFaculty = FACULTIES[activeIndex]

  return (
    <section
      ref={sectionRef}
      id="faculties-section"
      onMouseEnter={() => setIsPausedMobile(true)}
      onMouseLeave={() => setIsPausedMobile(false)}
      className="relative w-full bg-white lg:h-[235vh]"
    >
      {/* Sticky Viewport Container on Desktop */}
      <div className="w-full py-16 sm:py-24 lg:py-0 lg:sticky lg:top-0 lg:h-screen lg:flex lg:items-center px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden bg-white">
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center">
          {/* Section Heading */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-40px' }}
            className="max-w-4xl mx-auto text-center mb-10 sm:mb-14 md:mb-18 shrink-0"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal leading-[1.22] text-black tracking-[-0.01em]">
              Built Around the Future of Knowledge,
              <br />
              Research and Innovation
            </h2>
          </motion.div>

          {/* Main Content Grid */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Faculties Milestone List */}
            <div className="lg:col-span-6 flex relative">
              {/* Vertical Track / Active Indicator Line */}
              <div className="relative w-[3px] bg-gray-200/80 mr-5 sm:mr-8 flex-shrink-0 self-stretch rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 w-full bg-black rounded-full"
                  animate={{
                    top: `${(activeIndex / FACULTIES.length) * 100}%`,
                    height: `${100 / FACULTIES.length}%`,
                  }}
                  transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                />
              </div>

              {/* Faculty Items */}
              <div className="flex-1 flex flex-col justify-center gap-6 sm:gap-8 md:gap-9">
                {FACULTIES.map((faculty, index) => {
                  const isActive = activeIndex === index

                  return (
                    <div
                      key={faculty.id}
                      className="flex flex-col cursor-pointer group"
                      onClick={() => handleFacultyClick(index)}
                    >
                      {/* Faculty Title & Chevron */}
                      <button
                        type="button"
                        onClick={() => handleFacultyClick(index)}
                        className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
                        aria-expanded={isActive}
                      >
                        <h3
                          className={`text-lg sm:text-xl md:text-2xl lg:text-[25px] font-normal transition-colors duration-300 ${
                            isActive
                              ? 'text-black font-medium'
                              : 'text-gray-400 group-hover:text-gray-600'
                          }`}
                        >
                          {faculty.title}
                        </h3>
                        <HiChevronDown
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 flex-shrink-0 ${
                            isActive
                              ? 'text-black rotate-0'
                              : 'text-gray-400 -rotate-90 group-hover:text-gray-600'
                          }`}
                        />
                      </button>

                      {/* Faculty Description */}
                      <AnimatePresence initial={false}>
                        {isActive ? (
                          <motion.div
                            key="content"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base leading-relaxed text-gray-700 max-w-xl font-normal">
                              {faculty.description}
                            </p>
                          </motion.div>
                        ) : (
                          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-gray-400/90 max-w-xl font-normal transition-colors duration-300">
                            {faculty.description}
                          </p>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: 3 Slanted Images */}
            <div
              className="lg:col-span-6 relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px]"
              style={{ perspective: 1200 }}
            >
              {isDesktop ? (
                /* Desktop: Continuous Hardware-Accelerated 3D Scroll Parallax */
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                  {FACULTIES.map((faculty, idx) => (
                    <DesktopMosaicSet
                      key={faculty.id}
                      faculty={faculty}
                      index={idx}
                      progress={smoothProgress}
                    />
                  ))}
                </div>
              ) : (
                /* Mobile: AnimatePresence transitions */
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFaculty.id}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="w-full h-full grid grid-cols-2 gap-3.5 sm:gap-4 md:gap-5"
                  >
                    {/* Sub-column 1: Two stacked slanted images */}
                    <div
                      style={{ transformStyle: 'preserve-3d' }}
                      className="flex flex-col gap-3.5 sm:gap-4 md:gap-5 justify-between h-full"
                    >
                      <motion.div
                        variants={slantedImageVariants}
                        custom={0}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
                        className="overflow-hidden rounded-xl md:rounded-2xl shadow-md h-[calc(50%-7px)] sm:h-[calc(50%-8px)] md:h-[calc(50%-10px)] bg-gray-100 group relative will-change-transform"
                      >
                        <img
                          src={currentFaculty.images[0].src}
                          alt={currentFaculty.images[0].alt}
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="eager"
                        />
                      </motion.div>
                      <motion.div
                        variants={slantedImageVariants}
                        custom={1}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
                        className="overflow-hidden rounded-xl md:rounded-2xl shadow-md h-[calc(50%-7px)] sm:h-[calc(50%-8px)] md:h-[calc(50%-10px)] bg-gray-100 group relative will-change-transform"
                      >
                        <img
                          src={currentFaculty.images[1].src}
                          alt={currentFaculty.images[1].alt}
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="eager"
                        />
                      </motion.div>
                    </div>

                    {/* Sub-column 2: Tall single slanted image */}
                    <motion.div
                      variants={slantedImageVariants}
                      custom={2}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
                      className="overflow-hidden rounded-xl md:rounded-2xl shadow-md h-full bg-gray-100 group relative will-change-transform"
                    >
                      <img
                        src={currentFaculty.images[2].src}
                        alt={currentFaculty.images[2].alt}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="eager"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


