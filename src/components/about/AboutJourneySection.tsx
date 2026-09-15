import type { FC } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../../utils/motion'

export const AboutJourneySection: FC = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column: Heading */}
        <div className="lg:col-span-5 overflow-hidden">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-normal leading-[1.18] text-black tracking-[-0.01em]"
          >
            A Journey Shaped by Purpose
            <br />
            and Vision
          </motion.h2>
        </div>

        {/* Right Column: Lead Statement & Extended Narrative */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Lead Statement */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.15 }}
            className="text-lg sm:text-xl md:text-[22px] lg:text-[24px] font-medium leading-[1.38] text-black tracking-[-0.01em]"
          >
            Pearl University began with a clear vision to establish an institution where
            academic excellence, innovation, enterprise, and service could come together
            to create lasting value for students and society.
          </motion.p>

          {/* Extended Narrative */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.25 }}
            className="text-sm sm:text-base md:text-[16px] leading-[1.7] text-black/80 font-normal mt-6 sm:mt-8"
          >
            From its earliest foundations, the University has remained focused on developing
            relevant education, nurturing human potential, and creating an academic
            environment prepared for the opportunities and challenges of a changing world. This
            vision continues to shape Pearl University’s growth, guiding its commitment to
            rigorous learning, responsible research, practical capability, and a lasting
            contribution to communities, industry, and national development.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
