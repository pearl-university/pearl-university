import type { FC } from 'react'
import { motion } from 'framer-motion'
import img3 from '../../assets/images/about/img3.webp'
import { fadeInUp } from '../../utils/motion'

export const ViceChancellorSection: FC = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Column: Letter / Message Content */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Section Heading */}
          <div className="overflow-hidden">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-normal leading-[1.18] text-black tracking-[-0.01em]"
            >
              A Message from the
              <br />
              Vice-Chancellor
            </motion.h2>
          </div>

          {/* Salutation */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg font-medium text-black mt-6 sm:mt-8"
          >
            Welcome to Pearl University.
          </motion.p>

          {/* Letter Body Paragraphs */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sm:space-y-4.5 text-xs sm:text-sm md:text-[14.5px] leading-[1.72] text-gray-800 font-normal mt-4"
          >
            <p>
              Our vision is to build a university that does more than impart knowledge. We are
              creating an academic community that develops character, encourages innovation,
              strengthens enterprise, and prepares graduates to make meaningful contributions to
              society.
            </p>
            <p>
              At Pearl University, we believe education should be rigorous, relevant, and
              responsive to the realities of a changing world. Our commitment is to provide an
              environment where students are challenged to think critically, apply knowledge
              responsibly, and develop the confidence and practical capability required to lead
              and create lasting value.
            </p>
            <p>
              Through purposeful teaching, research, innovation, and service, we seek to nurture
              graduates who are not only prepared for successful careers, but also equipped to
              address real challenges, create opportunities, and contribute to the advancement of
              their communities and the wider society.
            </p>
            <p>
              As Pearl University continues to grow, we remain guided by our values of uprightness,
              integrity, responsiveness, excellence, innovation, and service. These principles
              define the kind of institution we aspire to be and the standard we expect from every
              member of our community.
            </p>
            <p>
              I invite you to discover Pearl University, engage with our vision, and become part of
              a community committed to building value through knowledge, purpose, and impact.
            </p>
          </motion.div>

          {/* Signoff / Office Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-6 border-t border-gray-100 flex flex-col"
          >
            <h4 className="text-xl sm:text-2xl font-heading font-normal text-black">
              Office of the Vice-Chancellor
            </h4>
            <span className="text-xs sm:text-sm text-gray-600 font-normal mt-1">
              Vice-Chancellor — Pearl University
            </span>
          </motion.div>
        </div>

        {/* Right Column: 3D Slanted Vice-Chancellor Portrait */}
        <div className="lg:col-span-6 flex justify-center" style={{ perspective: 1200 }}>
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
            whileHover={{
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              scale: 1.02,
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
            }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformPerspective: 1200,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full max-w-lg aspect-[4/5] sm:aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-black/10 bg-gray-100 group will-change-transform"
          >
            <img
              src={img3}
              alt="Vice-Chancellor of Pearl University"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
