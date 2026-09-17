import type { FC } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiOutlineAcademicCap, HiOutlineUsers, HiOutlineBookOpen } from 'react-icons/hi2'
import { fadeInUp } from '../../utils/motion'

interface PortalCard {
  id: string
  category: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  icon: typeof HiOutlineAcademicCap
  isDark?: boolean
}

const PORTALS: PortalCard[] = [
  {
    id: 'student',
    category: 'Undergraduate & Postgraduate',
    title: 'Student Portal',
    description:
      'Access essential academic services, including course registration, semester results, fee verification, and secure management of your bio-data profile.',
    buttonText: 'Access Dashboard',
    buttonLink: '/portals',
    icon: HiOutlineAcademicCap,
    isDark: true,
  },
  {
    id: 'staff',
    category: 'Academic & Non-Teaching',
    title: 'Staff Portal',
    description:
      'Manage teaching schedules, e-payslips, grade submissions, promotion records, and research tools through one secure platform.',
    buttonText: 'Access Staff Tools',
    buttonLink: '/portals',
    icon: HiOutlineUsers,
  },
  {
    id: 'library',
    category: 'Resources',
    title: 'E-Library',
    description:
      'Access digital books, journals, databases, research materials, and academic resources that support learning, teaching, and scholarly discovery.',
    buttonText: 'Access Resources',
    buttonLink: '/library',
    icon: HiOutlineBookOpen,
  },
]

export const PortalsSection: FC = () => {
  return (
    <section
      id="portals-section"
      className="w-full bg-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 transition-colors overflow-visible"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative">
        {/* Left Column: Sticky Title & Description (Sticks as right column scrolls) */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 self-start flex flex-col">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-40px' }}
            className="flex flex-col"
          >
            <h2 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-normal leading-[1.18] text-black tracking-[-0.01em]">
              Your Gateway to Essential
              <br />
              University Digital Services
            </h2>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-[16px] leading-relaxed text-gray-600 font-normal max-w-md">
              Access the essential digital platforms that support learning, teaching,
              research, administration, and everyday university life at Pearl.
            </p>
          </motion.div>
        </div>

        {/* Right Column: Natural Scrolling Cards Stack */}
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-7 md:gap-8">
          {PORTALS.map((portal, index) => {
            const IconComponent = portal.icon
            const isDark = portal.isDark

            return (
              <motion.div
                key={portal.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 flex flex-col justify-between group ${
                  isDark
                    ? 'bg-[#141416] text-white shadow-xl shadow-black/10'
                    : 'bg-[#EDEDEF] text-black hover:bg-[#E8E8EC]'
                }`}
              >
                {/* Card Top: Category, Title & Icon Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col">
                    <span
                      className={`text-xs sm:text-sm font-normal tracking-wide ${
                        isDark ? 'text-[#FDE88C]' : 'text-gray-500'
                      }`}
                    >
                      {portal.category}
                    </span>
                    <h3
                      className={`text-xl sm:text-2xl md:text-[28px] font-normal mt-1 font-heading tracking-tight ${
                        isDark ? 'text-white' : 'text-black'
                      }`}
                    >
                      {portal.title}
                    </h3>
                  </div>

                  {/* Icon Badge */}
                  <div
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                      isDark
                        ? 'bg-[#FDE88C] text-black'
                        : 'bg-white text-black shadow-xs'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>

                {/* Card Bottom: Description & CTA Button */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-6 sm:mt-8">
                  <p
                    className={`text-xs sm:text-sm md:text-[14.5px] leading-relaxed max-w-md font-normal ${
                      isDark ? 'text-white/80' : 'text-gray-600'
                    }`}
                  >
                    {portal.description}
                  </p>

                  <Link
                    to={portal.buttonLink}
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 cursor-pointer self-start sm:self-auto shrink-0 ${
                      isDark
                        ? 'bg-[#FDE88C] text-black hover:bg-[#FEE57B] hover:shadow-md'
                        : 'bg-white text-[#200441] hover:bg-gray-50 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <span>{portal.buttonText}</span>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
