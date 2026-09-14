import type { FC } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { CATEGORIES, NEWS_EVENTS } from '../../data/newsEvents'
import { fadeInUp } from '../../utils/motion'

export const NewsAndEventsSection: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Seminar')

  const handleSelectCategory = (category: string) => {
    if (category.toLowerCase() === activeCategory.toLowerCase()) return
    setActiveCategory(category)
  }

  const filteredItems = NEWS_EVENTS.filter(
    (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
  )

  return (
    <section
      id="news-and-events-section"
      data-hide-nav="true"
      className="w-full bg-[#EDE6F1] py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 transition-colors overflow-visible"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative">
        {/* Left Column: Sticky "News and Event" Title & Scrollable Category Navigation */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 self-start flex flex-col max-h-[calc(100vh-140px)]">
          {/* Left Header Title */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mb-6 sm:mb-8 shrink-0"
          >
            <span className="text-lg sm:text-xl font-normal text-black font-heading">
              News and Event
            </span>
          </motion.div>

          {/* Categories Navigation with Lenis-prevented native inner scroll */}
          <div
            data-lenis-prevent="true"
            className="flex lg:flex-col flex-wrap gap-4 sm:gap-5 md:gap-6 overflow-y-auto overscroll-contain pr-3 py-1 [scrollbar-width:thin] [scrollbar-color:#00000020_transparent] lg:max-h-[calc(100vh-220px)]"
          >
            {CATEGORIES.map((category) => {
              const isActive =
                activeCategory.toLowerCase() === category.toLowerCase()

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className={`text-left text-xl sm:text-2xl md:text-[26px] font-normal font-heading transition-all duration-200 cursor-pointer focus:outline-none relative group ${
                    isActive
                      ? 'text-black font-medium scale-[1.03] origin-left'
                      : 'text-gray-400/90 hover:text-gray-700'
                  }`}
                  aria-pressed={isActive}
                >
                  <span>/{category}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Heading & 2-Column Static Uniformly Slanted News & Event Cards */}
        <div className="lg:col-span-8 w-full flex flex-col">
          {/* Main Headline */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.18] text-black tracking-[-0.01em]">
              Moments That Shape the
              <br />
              Pearl Community
            </h2>
          </motion.div>

          {/* Static Uniform Slanted Cards Grid (No animation discrepancies) */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    transform:
                      'perspective(1200px) rotateX(6deg) rotateY(-8deg) rotateZ(1.5deg)',
                    transformStyle: 'preserve-3d',
                  }}
                  className="h-full"
                >
                  <Link
                    to={item.link || '/news-and-event'}
                    className="bg-white group flex flex-col justify-between overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full rounded-xl"
                  >
                    {/* Card Top Image & Date Badge */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      {/* Floating Date Badge */}
                      <div className="absolute top-4 left-4 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-black shadow-xs rounded-sm">
                        {item.date}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7 md:p-8 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-normal leading-snug text-black font-heading group-hover:text-[#200441] transition-colors">
                          {item.title}
                        </h3>

                        <p className="mt-4 text-xs sm:text-sm md:text-[14.5px] leading-relaxed text-gray-600 font-normal">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer: Read More & Arrow */}
                      <div className="mt-8 pt-4 flex items-center justify-between">
                        <span className="text-sm sm:text-base font-medium text-black group-hover:underline">
                          Read More
                        </span>

                        <div className="w-10 h-10 rounded-full border border-black/80 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                          <FiArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State when no items in category */
            <div className="bg-white/80 backdrop-blur-xs p-12 sm:p-16 text-center flex flex-col items-center justify-center rounded-xl border border-black/5">
              <h3 className="text-2xl font-normal font-heading text-black">
                No /{activeCategory} Events Currently
              </h3>
              <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-md">
                We are preparing upcoming events and announcements for this
                category. Check back soon for the latest updates.
              </p>
              <button
                type="button"
                onClick={() => handleSelectCategory('Seminar')}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:scale-95 transition-all cursor-pointer"
              >
                View Seminar Events
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
