import type { FC } from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  HiXMark,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2'
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi'

// Gallery Images
import img7 from '../../assets/images/home/img7.webp'
import img8 from '../../assets/images/home/img8.webp'
import img9 from '../../assets/images/home/img9.webp'
import img10 from '../../assets/images/home/img10.webp'
import img1 from '../../assets/images/home/img1.png'
import img2 from '../../assets/images/home/img2.webp'
import img3 from '../../assets/images/home/img3.webp'
import img4 from '../../assets/images/home/img4.webp'
import img5 from '../../assets/images/home/img5.png'
import img6 from '../../assets/images/home/img6.webp'
import img11 from '../../assets/images/home/img11.webp'
import img12 from '../../assets/images/home/img12.webp'

import { fadeInUp, staggerContainer } from '../../utils/motion'

export interface GalleryMoment {
  id: string
  title: string
  category: string
  date: string
  location: string
  description: string
  image: string
  hotspot?: {
    x: number // percentage 0-100
    y: number
    label: string
    detail: string
  }
}

const FEATURED_MOMENTS: GalleryMoment[] = [
  {
    id: 'moment-1',
    title: 'Pearl Entrepreneurship Conference',
    category: 'Keynote & Panels',
    date: 'October 14, 2025',
    location: 'Main Auditorium, Pearl Campus',
    description:
      'Distinguished global delegates, ministerial leaders, and venture innovators gather for high-impact discussions on enterprise development and economic transformation.',
    image: img7,
    hotspot: {
      x: 74,
      y: 36,
      label: 'Ministerial Keynote Speaker',
      detail: 'Hon. Joseph Nsengimana on Harnessing African Education for Sustainable Growth',
    },
  },
  {
    id: 'moment-2',
    title: 'Pearl University Founders’ Day',
    category: 'Traditions & Heritage',
    date: 'November 28, 2025',
    location: 'Grand Assembly Hall',
    description:
      'Commemorating the visionary foundation, academic milestones, and enduring legacy of excellence that define our university community.',
    image: img8,
  },
  {
    id: 'moment-3',
    title: 'Entrepreneurship and Enterprise Conference',
    category: 'Interactive Symposia',
    date: 'January 19, 2026',
    location: 'Executive Lecture Complex',
    description:
      'Scholars and aspiring student founders engage actively in open dialogue, pitching startup ideas and exploring emerging frontier market solutions.',
    image: img9,
  },
  {
    id: 'moment-4',
    title: 'New Student Welcome Ceremony',
    category: 'Matriculation & Honors',
    date: 'September 05, 2025',
    location: 'University Amphitheatre',
    description:
      'Inducting incoming matriculants into the Pearl scholar community with time-honored academic traditions, pride, and inspiring addresses.',
    image: img10,
  },
]

const EXTENDED_MOMENTS: GalleryMoment[] = [
  ...FEATURED_MOMENTS,
  {
    id: 'moment-5',
    title: 'Annual Commencement & Honors Convocation',
    category: 'Graduation',
    date: 'July 18, 2025',
    location: 'Convocation Arena',
    description:
      'Celebrating the triumphant graduating class as they receive their degrees and step forth into high-impact global careers.',
    image: img1,
  },
  {
    id: 'moment-6',
    title: 'High-Performance Computing Research Lab',
    category: 'Innovation',
    date: 'February 12, 2026',
    location: 'Computing & AI Complex',
    description:
      'Undergraduate and postgraduate researchers developing distributed machine learning algorithms and cybersecurity defense frameworks.',
    image: img2,
  },
  {
    id: 'moment-7',
    title: 'Collaborative Outdoor Study & Campus Gardens',
    category: 'Student Life',
    date: 'March 02, 2026',
    location: 'North Quad Courtyard',
    description:
      'Students collaborating in lush campus green spaces, combining peaceful natural aesthetics with energetic team projects.',
    image: img3,
  },
  {
    id: 'moment-8',
    title: 'Inter-Faculty Science & Robotics Exhibition',
    category: 'Exhibitions',
    date: 'April 09, 2026',
    location: 'Technology Center',
    description:
      'Showcasing student-engineered automated systems, solar robotics, and healthcare diagnostic devices to visiting industry partners.',
    image: img4,
  },
  {
    id: 'moment-9',
    title: 'Clinical Simulation & Healthcare Practicals',
    category: 'Allied Health',
    date: 'May 14, 2026',
    location: 'Health Sciences Complex',
    description:
      'Hands-on clinical training utilizing state-of-the-art simulation equipment for emergency response and patient management.',
    image: img5,
  },
  {
    id: 'moment-10',
    title: 'Health Sciences & Diagnostic Laboratory',
    category: 'Medical Research',
    date: 'June 21, 2026',
    location: 'Pathology Center',
    description:
      'Conducting vital medical diagnostic research, microbiological testing, and public health epidemiology data analysis.',
    image: img6,
  },
  {
    id: 'moment-11',
    title: 'Finance & Leadership Interactive Hub',
    category: 'Executive Education',
    date: 'August 04, 2025',
    location: 'Management Institute',
    description:
      'Executive masterclasses in forensic accounting, international finance, and ethical corporate leadership.',
    image: img11,
  },
  {
    id: 'moment-12',
    title: 'Advanced Medical Diagnostics & Surgery Simulation',
    category: 'Clinical Excellence',
    date: 'September 29, 2025',
    location: 'Allied Sciences Building',
    description:
      'Pioneering clinical diagnostics and robotic surgery simulation sessions for next-generation medical practitioners.',
    image: img12,
  },
]

// 3D Tilt Card Component for Tactile Interaction
interface InteractiveCardProps {
  moment: GalleryMoment
  className?: string
  aspectRatioClass?: string
  onClick: (moment: GalleryMoment) => void
}

const InteractiveGalleryCard: FC<InteractiveCardProps> = ({
  moment,
  className = '',
  aspectRatioClass = 'h-[270px] sm:h-[300px] md:h-[320px]',
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 220, mass: 0.1 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(moment)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      className={`relative ${aspectRatioClass} ${className} rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-500 bg-gray-100 will-change-transform select-none`}
    >
      {/* Background Image with Cinematic Zoom */}
      <img
        src={moment.image}
        alt={moment.title}
        className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      {/* Multi-layered Vignette & Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent group-hover:from-black/95 group-hover:via-black/35 transition-colors duration-300 pointer-events-none" />

      {/* Shimmer / Glass Glare Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          transform: 'translateZ(20px)',
        }}
      />

      {/* Bottom Title Only */}
      <div
        style={{ transform: 'translateZ(35px)' }}
        className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end"
      >
        <h3 className="text-white text-base sm:text-lg md:text-xl font-normal leading-snug tracking-tight drop-shadow-md group-hover:text-amber-200 transition-colors duration-300 font-heading">
          {moment.title}
        </h3>
      </div>
    </motion.div>
  )
}

export const ExperienceGallerySection: FC = () => {
  const [activeMoment, setActiveMoment] = useState<GalleryMoment | null>(null)
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>('All')
  const [isZoomed, setIsZoomed] = useState(false)

  // Filter categories for the extended gallery modal
  const categories = ['All', 'Conferences', 'Traditions', 'Ceremonies', 'Innovation', 'Student Life']

  const filteredExtendedMoments = EXTENDED_MOMENTS.filter((item) => {
    if (selectedFilter === 'All') return true
    if (selectedFilter === 'Conferences')
      return item.category.toLowerCase().includes('conference') || item.category.toLowerCase().includes('symposia')
    if (selectedFilter === 'Traditions')
      return item.category.toLowerCase().includes('tradition') || item.category.toLowerCase().includes('heritage')
    if (selectedFilter === 'Ceremonies')
      return item.category.toLowerCase().includes('ceremon') || item.category.toLowerCase().includes('matriculat') || item.category.toLowerCase().includes('graduation')
    if (selectedFilter === 'Innovation')
      return item.category.toLowerCase().includes('innovation') || item.category.toLowerCase().includes('research') || item.category.toLowerCase().includes('health')
    if (selectedFilter === 'Student Life')
      return item.category.toLowerCase().includes('student') || item.category.toLowerCase().includes('life') || item.category.toLowerCase().includes('exhibition')
    return true
  })

  // Keyboard controls for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!activeMoment) return

      if (e.key === 'Escape') {
        setActiveMoment(null)
        setIsZoomed(false)
      } else if (e.key === 'ArrowRight') {
        const currentIndex = EXTENDED_MOMENTS.findIndex((m) => m.id === activeMoment.id)
        const nextIndex = (currentIndex + 1) % EXTENDED_MOMENTS.length
        setActiveMoment(EXTENDED_MOMENTS[nextIndex])
        setIsZoomed(false)
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = EXTENDED_MOMENTS.findIndex((m) => m.id === activeMoment.id)
        const prevIndex = (currentIndex - 1 + EXTENDED_MOMENTS.length) % EXTENDED_MOMENTS.length
        setActiveMoment(EXTENDED_MOMENTS[prevIndex])
        setIsZoomed(false)
      }
    },
    [activeMoment]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleNext = () => {
    if (!activeMoment) return
    const currentIndex = EXTENDED_MOMENTS.findIndex((m) => m.id === activeMoment.id)
    const nextIndex = (currentIndex + 1) % EXTENDED_MOMENTS.length
    setActiveMoment(EXTENDED_MOMENTS[nextIndex])
    setIsZoomed(false)
  }

  const handlePrev = () => {
    if (!activeMoment) return
    const currentIndex = EXTENDED_MOMENTS.findIndex((m) => m.id === activeMoment.id)
    const prevIndex = (currentIndex - 1 + EXTENDED_MOMENTS.length) % EXTENDED_MOMENTS.length
    setActiveMoment(EXTENDED_MOMENTS[prevIndex])
    setIsZoomed(false)
  }

  return (
    <section
      id="experience-gallery-section"
      className="w-full bg-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        {/* Top Header & Explore Gallery Button */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-60px' }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.18] text-black tracking-[-0.01em]">
              Moments That Define the Pearl
              <br />
              Experience.
            </h2>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsFullGalleryOpen(true)}
              className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-black text-black font-medium text-sm sm:text-base hover:bg-black hover:text-white transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 cursor-pointer shadow-xs group"
            >
              <span>Explore Gallery</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </motion.div>

        {/* Gallery Grid Matching Screenshot s7.png */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-60px' }}
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-5"
        >
          {/* Left Column (8 cols): Top Row (2 Cards) + Bottom Row (1 Wide Card) */}
          <div className="lg:col-span-8 flex flex-col gap-3 sm:gap-4 md:gap-5">
            {/* Top Row: 2 Cards side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              {/* Tile 1: Pearl Entrepreneurship Conference (with interactive hotspot) */}
              <InteractiveGalleryCard
                moment={FEATURED_MOMENTS[0]}
                aspectRatioClass="h-[270px] sm:h-[300px] md:h-[320px]"
                onClick={setActiveMoment}
              />

              {/* Tile 2: Pearl University Founders’ Day */}
              <InteractiveGalleryCard
                moment={FEATURED_MOMENTS[1]}
                aspectRatioClass="h-[270px] sm:h-[300px] md:h-[320px]"
                onClick={setActiveMoment}
              />
            </div>

            {/* Bottom Row: 1 Wide Card */}
            <InteractiveGalleryCard
              moment={FEATURED_MOMENTS[2]}
              aspectRatioClass="h-[260px] sm:h-[290px] md:h-[310px]"
              onClick={setActiveMoment}
            />
          </div>

          {/* Right Column (4 cols): 1 Tall Single Card spanning entire height */}
          <div className="lg:col-span-4 h-full">
            <InteractiveGalleryCard
              moment={FEATURED_MOMENTS[3]}
              aspectRatioClass="h-[340px] sm:h-[450px] lg:h-full min-h-[340px] lg:min-h-[650px]"
              onClick={setActiveMoment}
            />
          </div>
        </motion.div>
      </div>

      {/* Interactive Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 md:p-8"
            onClick={() => setActiveMoment(null)}
          >
            {/* Top Bar: Title, Category & Close Button */}
            <div
              className="flex items-center justify-between text-white z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium text-emerald-400 border border-emerald-400/20">
                  {activeMoment.category}
                </span>
                <span className="hidden sm:inline text-xs text-gray-400">
                  {activeMoment.date} • {activeMoment.location}
                </span>
              </div>

              {/* Controls: Zoom & Close */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
                >
                  {isZoomed ? <FiMinimize2 className="w-5 h-5" /> : <FiMaximize2 className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMoment(null)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Main Center Image Container with Prev/Next Controls */}
            <div
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                aria-label="Previous image"
              >
                <HiChevronLeft className="w-6 h-6" />
              </button>

              {/* Active High-Res Photo Display */}
              <motion.div
                key={activeMoment.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  scale: isZoomed ? 1.35 : 1,
                }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-5xl max-h-[70vh] flex flex-col items-center justify-center cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={activeMoment.image}
                  alt={activeMoment.title}
                  className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
                />
              </motion.div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                aria-label="Next image"
              >
                <HiChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Bar: Caption Details & Thumbnail Selector Strip */}
            <div
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-white z-20 max-w-6xl mx-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Moment Info */}
              <div className="max-w-xl">
                <h4 className="text-lg sm:text-xl font-medium text-white font-heading">
                  {activeMoment.title}
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-gray-300 line-clamp-2">
                  {activeMoment.description}
                </p>
              </div>

              {/* Thumbnails Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full [scrollbar-width:none]">
                {EXTENDED_MOMENTS.map((item) => {
                  const isCurrent = item.id === activeMoment.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveMoment(item)
                        setIsZoomed(false)
                      }}
                      className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-emerald-400 scale-105 opacity-100'
                          : 'opacity-40 hover:opacity-80'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Gallery Extended Showcase Modal (Triggered by "Explore Gallery" button) */}
      <AnimatePresence>
        {isFullGalleryOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl overflow-y-auto p-4 sm:p-6 md:p-10 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                <div>
                  <span className="text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-widest">
                    Pearl University Archive
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white font-heading mt-1">
                    Campus Life & Moments Gallery
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullGalleryOpen(false)}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close gallery"
                >
                  <HiXMark className="w-7 h-7" />
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      selectedFilter === cat
                        ? 'bg-white text-black font-semibold scale-105 shadow-md'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Extended Moments Grid */}
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 flex-1"
              >
                {filteredExtendedMoments.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      setIsFullGalleryOpen(false)
                      setActiveMoment(item)
                    }}
                    className="group relative h-[260px] sm:h-[280px] rounded-2xl overflow-hidden bg-gray-900 cursor-pointer border border-white/10 hover:border-emerald-400/50 transition-colors shadow-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/95 transition-colors" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/20 backdrop-blur-md text-white">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white text-base font-normal group-hover:text-amber-200 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-300 mt-1">{item.date}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Modal Footer */}
              <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <p>Showing {filteredExtendedMoments.length} curated university moments</p>
                <button
                  type="button"
                  onClick={() => setIsFullGalleryOpen(false)}
                  className="text-white hover:underline cursor-pointer"
                >
                  Back to Home Page ↑
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
