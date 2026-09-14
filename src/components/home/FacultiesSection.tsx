import type { FC } from 'react'
import { useState, useEffect } from 'react'
import type { Variants } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronDown } from 'react-icons/hi2'
import img2 from '../../assets/images/home/img2.png'
import img3 from '../../assets/images/home/img3.webp'
import img4 from '../../assets/images/home/img4.webp'
import img5 from '../../assets/images/home/img5.jpg'
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

export const FacultiesSection: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(false)

  // Auto-repeating cyclical slide-in effect across faculties
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FACULTIES.length)
    }, 4500)

    return () => clearInterval(interval)
  }, [isPaused, activeIndex])

  const handleSelectFaculty = (index: number) => {
    if (index === activeIndex) return
    setActiveIndex(index)
  }

  const currentFaculty = FACULTIES[activeIndex]

  return (
    <section
      id="faculties-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center">
        {/* Section Heading */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
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
          {/* Left Column: Faculties Accordion */}
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

            {/* Faculty List */}
            <div className="flex-1 flex flex-col justify-center gap-6 sm:gap-8 md:gap-9">
              {FACULTIES.map((faculty, index) => {
                const isActive = activeIndex === index

                return (
                  <div
                    key={faculty.id}
                    className="flex flex-col cursor-pointer group"
                    onClick={() => handleSelectFaculty(index)}
                  >
                    {/* Faculty Title & Chevron */}
                    <button
                      type="button"
                      onClick={() => handleSelectFaculty(index)}
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

          {/* Right Column: 3 Slanted Images with 3D Slant In / Slant Out on Click */}
          <div
            className="lg:col-span-6 relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px]"
            style={{ perspective: 1200 }}
          >
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
          </div>
        </div>
      </div>
    </section>
  )
}
