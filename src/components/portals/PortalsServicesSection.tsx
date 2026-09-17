import type { FC } from 'react'
import { motion } from 'framer-motion'
import { HiAcademicCap } from 'react-icons/hi2'
import { FiArchive, FiInbox } from 'react-icons/fi'
import { fadeInUp } from '../../utils/motion'

interface PortalCard {
  id: string
  category: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  isDark?: boolean
  icon: React.ReactNode
  slant: {
    rotateX: number
    rotateY: number
    rotateZ: number
  }
}

const PORTALS: PortalCard[] = [
  {
    id: 'student-portal',
    category: 'Undergraduate & Postgraduate',
    title: 'Student Portal',
    description:
      'Access essential academic services, including course registration, semester results, fee verification, and secure management of your bio-data profile.',
    buttonText: 'Access Dashboard',
    buttonLink: '#student-portal',
    isDark: true,
    icon: <HiAcademicCap className="w-5 h-5 text-black" />,
    slant: { rotateX: 4, rotateY: -5, rotateZ: 1 },
  },
  {
    id: 'e-library',
    category: 'Resources',
    title: 'E-Library',
    description:
      'Access digital books, journals, databases, research materials, and academic resources that support learning, teaching, and scholarly discovery.',
    buttonText: 'Access Resources',
    buttonLink: '/library',
    icon: <FiArchive className="w-5 h-5 text-black" />,
    slant: { rotateX: 4, rotateY: 0, rotateZ: 0 },
  },
  {
    id: 'e-learning',
    category: 'Resources',
    title: 'E-Learning Portal',
    description:
      'Access course materials, lectures, assignments, assessments, and digital learning resources through a secure platform designed to support flexible and continuous academic engagement.',
    buttonText: 'Access Dashboard',
    buttonLink: '#e-learning',
    icon: <FiInbox className="w-5 h-5 text-black" />,
    slant: { rotateX: 4, rotateY: 5, rotateZ: -1 },
  },
]

export const PortalsServicesSection: FC = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16 md:gap-20">
        {/* Section Heading */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-40px' }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-heading font-normal leading-[1.2] text-black tracking-[-0.01em]">
            Your Central Access to Academic
            <br />
            Services
          </h2>
        </motion.div>

        {/* 3 Portal Cards Grid with 3D Slanted Architecture */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          style={{ perspective: 1200 }}
        >
          {PORTALS.map((portal, index) => {
            return (
              <motion.div
                key={portal.id}
                initial={{
                  opacity: 0,
                  y: 50,
                  rotateX: portal.slant.rotateX * 2,
                  rotateY: portal.slant.rotateY * 2,
                  rotateZ: portal.slant.rotateZ * 2,
                  scale: 0.94,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: portal.slant.rotateX,
                  rotateY: portal.slant.rotateY,
                  rotateZ: portal.slant.rotateZ,
                  scale: 1,
                }}
                whileHover={{
                  y: -8,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: 1.02,
                  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                }}
                viewport={{ once: false, margin: '-40px' }}
                transition={{
                  duration: 0.85,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  transformPerspective: 1200,
                  transformStyle: 'preserve-3d',
                }}
                className={`flex flex-col justify-between rounded-2xl sm:rounded-3xl p-7 sm:p-8 md:p-9 min-h-[460px] sm:min-h-[500px] transition-shadow duration-300 will-change-transform ${
                  portal.isDark
                    ? 'bg-[#141416] text-white shadow-2xl shadow-black/15'
                    : 'bg-white border border-black/80 text-black shadow-lg shadow-black/5 hover:border-black'
                }`}
              >
                {/* Top Header Information */}
                <div className="flex flex-col">
                  {/* Icon Badge */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center mb-6 sm:mb-8 transition-transform duration-300 ${
                      portal.isDark
                        ? 'bg-[#FDE88C] text-black shadow-md'
                        : 'bg-[#EDEDEF] text-black'
                    }`}
                  >
                    {portal.icon}
                  </div>

                  {/* Category Tag */}
                  <span
                    className={`text-xs sm:text-sm font-normal tracking-tight ${
                      portal.isDark ? 'text-[#FDE88C]' : 'text-gray-600'
                    }`}
                  >
                    {portal.category}
                  </span>

                  {/* Title */}
                  <h3
                    className={`text-2xl sm:text-3xl font-heading font-normal mt-2 leading-snug ${
                      portal.isDark ? 'text-white' : 'text-black'
                    }`}
                  >
                    {portal.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm sm:text-[15px] leading-relaxed mt-4 sm:mt-5 font-normal ${
                      portal.isDark ? 'text-white/85' : 'text-gray-700'
                    }`}
                  >
                    {portal.description}
                  </p>
                </div>

                {/* Bottom Action Pill Button */}
                <div className="mt-8 sm:mt-10 pt-4">
                  <a
                    href={portal.buttonLink}
                    className={`w-full py-3.5 sm:py-4 px-6 rounded-full text-center text-sm sm:text-base font-medium transition-all duration-200 block focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer ${
                      portal.isDark
                        ? 'bg-[#FDE88C] text-[#200441] hover:bg-[#ffe57a] active:bg-[#fbd850] shadow-md'
                        : 'bg-transparent border border-black text-[#200441] hover:bg-black hover:text-white active:bg-neutral-900'
                    }`}
                  >
                    {portal.buttonText}
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
