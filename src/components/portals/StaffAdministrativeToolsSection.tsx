import type { FC } from 'react'
import { motion } from 'framer-motion'
import { HiAcademicCap } from 'react-icons/hi2'
import { FiArchive, FiInbox } from 'react-icons/fi'
import { fadeInUp } from '../../utils/motion'

interface ToolCard {
  id: string
  category: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  icon: React.ReactNode
  slant: {
    rotateX: number
    rotateY: number
    rotateZ: number
  }
}

const TOOLS: ToolCard[] = [
  {
    id: 'academic-staff-portal',
    category: 'Staff & Faculty',
    title: 'Academic Staff Portal',
    description:
      'Teaching schedules, course management, class lists, grade submission, assessments, and academic records.',
    buttonText: 'Access Dashboard',
    buttonLink: '#academic-staff-portal',
    icon: <HiAcademicCap className="w-5 h-5 text-black" />,
    slant: { rotateX: 4, rotateY: -5, rotateZ: 1 },
  },
  {
    id: 'hr-payroll-portal',
    category: 'Staff & Faculty',
    title: 'HR & Payroll Portal',
    description:
      'Staff profiles, leave requests, e-payslips, benefits, promotion records, performance documentation, and employment information.',
    buttonText: 'Access Dashboard',
    buttonLink: '#hr-payroll-portal',
    icon: <FiArchive className="w-5 h-5 text-black" />,
    slant: { rotateX: 4, rotateY: 0, rotateZ: 0 },
  },
  {
    id: 'research-grants-portal',
    category: 'Institutional Gateway',
    title: 'Research & Grants Portal',
    description:
      'Research profiles, publications, project records, grant applications, ethics submissions, collaborations, and research administration.',
    buttonText: 'Access Dashboard',
    buttonLink: '#research-grants-portal',
    icon: <FiInbox className="w-5 h-5 text-black" />,
    slant: { rotateX: 4, rotateY: 5, rotateZ: -1 },
  },
]

export const StaffAdministrativeToolsSection: FC = () => {
  return (
    <section className="w-full bg-white pt-8 sm:pt-12 md:pt-16 pb-20 sm:pb-28 md:pb-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
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
            Connected Tools for Academic and
            <br />
            Administrative Work
          </h2>
        </motion.div>

        {/* 3 Staff & Faculty Portal Cards Grid with 3D Slanted Architecture */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          style={{ perspective: 1200 }}
        >
          {TOOLS.map((tool, index) => {
            return (
              <motion.div
                key={tool.id}
                initial={{
                  opacity: 0,
                  y: 50,
                  rotateX: tool.slant.rotateX * 2,
                  rotateY: tool.slant.rotateY * 2,
                  rotateZ: tool.slant.rotateZ * 2,
                  scale: 0.94,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: tool.slant.rotateX,
                  rotateY: tool.slant.rotateY,
                  rotateZ: tool.slant.rotateZ,
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
                className="flex flex-col justify-between rounded-2xl sm:rounded-3xl p-7 sm:p-8 md:p-9 min-h-[460px] sm:min-h-[500px] bg-white border border-black/80 text-black shadow-lg shadow-black/5 hover:border-black transition-shadow duration-300 will-change-transform"
              >
                {/* Top Header Information */}
                <div className="flex flex-col">
                  {/* Icon Badge */}
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mb-6 sm:mb-8 bg-[#EDEDEF] text-black transition-transform duration-300">
                    {tool.icon}
                  </div>

                  {/* Category Tag */}
                  <span className="text-xs sm:text-sm font-normal tracking-tight text-gray-600">
                    {tool.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-heading font-normal mt-2 leading-snug text-black">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-[15px] leading-relaxed mt-4 sm:mt-5 font-normal text-gray-700">
                    {tool.description}
                  </p>
                </div>

                {/* Bottom Action Pill Button */}
                <div className="mt-8 sm:mt-10 pt-4">
                  <a
                    href={tool.buttonLink}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-full text-center text-sm sm:text-base font-medium transition-all duration-200 block focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer bg-transparent border border-black text-[#200441] hover:bg-black hover:text-white active:bg-neutral-900"
                  >
                    {tool.buttonText}
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
