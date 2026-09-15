import type { FC } from 'react'
import { motion } from 'framer-motion'
import { FiFlag, FiEye, FiTarget } from 'react-icons/fi'
import img2 from '../../assets/images/about/img2.webp'
import { fadeInUp } from '../../utils/motion'

export const MissionVisionSection: FC = () => {
  return (
    <section className="w-full bg-[#EDE6F1] py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 sm:gap-14 md:gap-16">
        {/* Header: Title on Left, Description on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start">
          {/* Left Column: Title */}
          <div className="lg:col-span-6 overflow-hidden">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-normal leading-[1.18] text-black tracking-[-0.01em]"
            >
              Building Value Through
              <br />
              Purpose, Vision, and Impact
            </motion.h2>
          </div>

          {/* Right Column: Top Description */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-6 lg:pt-2"
          >
            <p className="text-sm sm:text-base md:text-[17px] leading-relaxed text-black/85 font-normal max-w-xl">
              Our vision defines the future we seek to create, our mission guides how we will
              achieve it, and our commitment reflects the standards and values that shape every
              aspect of the Pearl University experience.
            </p>
          </motion.div>
        </div>

        {/* Content Grid: Left 3D Slanted Image vs Right Mission / Vision / Commitment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left Column: 3D Slanted Student Image */}
          <div className="lg:col-span-5 flex" style={{ perspective: 1200 }}>
            <motion.div
              initial={{ opacity: 0, y: 45, rotateX: 12, rotateY: -14, rotateZ: -2, scale: 0.94 }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotateX: 6,
                rotateY: -8,
                rotateZ: 1.5,
                scale: 1,
              }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full h-full min-h-[380px] sm:min-h-[440px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl shadow-black/8 bg-gray-200 group will-change-transform"
            >
              <img
                src={img2}
                alt="Pearl University student engaged in focused academic research"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Right Column: Mission, Vision, and Commitment Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-6">
            {/* Top Row: Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Mission Card */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-300 border border-black/5"
              >
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#EDE6F1] flex items-center justify-center text-black mb-5 sm:mb-6">
                    <FiFlag className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-normal text-black leading-snug">
                    Our Mission
                  </h3>
                  <p className="text-xs sm:text-sm md:text-[14.5px] leading-relaxed text-gray-700 font-normal mt-3 sm:mt-4">
                    To deliver technology- and entrepreneurship-driven curricula that develop capable
                    graduates and produce research outcomes relevant to the needs of the economy
                    and society.
                  </p>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-300 border border-black/5"
              >
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#EDE6F1] flex items-center justify-center text-black mb-5 sm:mb-6">
                    <FiEye className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-normal text-black leading-snug">
                    Our Vision
                  </h3>
                  <p className="text-xs sm:text-sm md:text-[14.5px] leading-relaxed text-gray-700 font-normal mt-3 sm:mt-4">
                    To be a dynamic hub for technopreneurs, innovation, academic excellence, and
                    development-driven research, propelled by contemporary realities towards the
                    advancement of people and society.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Bottom Row: Commitment Card */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-300 border border-black/5"
            >
              <div>
                <div className="w-11 h-11 rounded-full bg-[#EDE6F1] flex items-center justify-center text-black mb-5 sm:mb-6">
                  <FiTarget className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-normal text-black leading-snug">
                  Our Commitment
                </h3>
                <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-gray-700 font-normal mt-3 sm:mt-4">
                  We are committed to building value through rigorous learning, responsible
                  research, purposeful innovation, and service. We cultivate knowledge, character,
                  integrity, and practical capability while preparing graduates to contribute
                  meaningfully to their professions, communities, and society.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
