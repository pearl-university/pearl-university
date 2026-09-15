import type { FC } from 'react'
import { motion } from 'framer-motion'
import img2 from '../../assets/images/academics/img2.webp'
import img3 from '../../assets/images/academics/img3.webp'
import { fadeInUp } from '../../utils/motion'

export const ApproachSection: FC = () => {
  return (
    <section className="w-full bg-white pt-16 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-14 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      <div className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10">
        {/* Header: Title on Left, Top Description on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start">
          {/* Left Column: Title with masked smooth rise */}
          <div className="lg:col-span-6 overflow-hidden">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-40px' }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-normal leading-[1.18] text-black tracking-[-0.01em]"
            >
              A Distinctive Approach to
              <br />
              Learning and Practice
            </motion.h2>
          </div>

          {/* Right Column: Top Description */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-40px' }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-6 lg:pt-2"
          >
            <p className="text-base sm:text-lg md:text-[18px] leading-relaxed text-black/85 font-normal max-w-xl">
              Our approach combines rigorous academic learning with practical experience,
              critical thinking, and real-world application, preparing students to turn knowledge
              into capability and meaningful impact.
            </p>
          </motion.div>
        </div>

        {/* Content Grid: Left Tall Slanted Image vs Right Landscape Slanted Image + Paragraph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Slanted Left Image */}
          <div className="lg:col-span-6" style={{ perspective: 1200 }}>
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
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full aspect-[4/3] sm:aspect-[14/11] lg:aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl shadow-black/8 bg-gray-100 group will-change-transform"
            >
              <img
                src={img2}
                alt="Students studying and collaborating outdoors on campus"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Right Column: Slanted Opposite Image + Bottom Paragraph */}
          <div className="lg:col-span-6 flex flex-col gap-8 sm:gap-10">
            {/* Right Slanted Image (Slanted in Opposite Direction) */}
            <div className="w-full" style={{ perspective: 1200 }}>
              <motion.div
                initial={{ opacity: 0, y: 45, rotateX: 12, rotateY: 14, rotateZ: 2, scale: 0.94 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: 6,
                  rotateY: 8,
                  rotateZ: -1.5,
                  scale: 1,
                }}
                viewport={{ once: false, margin: '-40px' }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transformPerspective: 1200,
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl shadow-black/8 bg-gray-100 group will-change-transform"
              >
                <img
                  src={img3}
                  alt="Diverse group of smiling students walking and discussing together"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* Bottom Paragraph */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-40px' }}
              transition={{ delay: 0.25 }}
            >
              <p className="text-sm sm:text-base md:text-[17px] leading-relaxed text-black/85 font-normal max-w-xl">
                Through purposeful teaching, collaboration, and continuous development, we equip
                learners to respond confidently to emerging challenges and opportunities, think
                independently, apply knowledge responsibly, and build the skills and judgement
                required to create meaningful value in their professions and communities.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
