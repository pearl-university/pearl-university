import type { FC } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone } from 'react-icons/fi'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import studentAvatarImg from '../../../assets/images/student-portal/john_offiong.jpg'
import { STUDENT_PROFILE_DATA } from '../../../data/studentData'

export const AcceptanceFeeHero: FC = () => {
  const student = STUDENT_PROFILE_DATA

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1b0a33]/80 border border-[#3b1f66] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden backdrop-blur-md"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Circular Student Portrait */}
        <div className="relative shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-white/15 shadow-xl bg-[#261245]">
            <img
              src={studentAvatarImg}
              alt={student.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Student Credentials */}
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
          {/* Name, IDs and Top Badges */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {student.name}
              </h2>
              <span className="text-gray-400 font-normal text-sm hidden xs:inline">•</span>
              <span className="text-gray-300 text-xs sm:text-sm font-mono">
                {student.appNumber}
              </span>
              <span className="text-gray-400 font-normal text-sm hidden xs:inline">•</span>
              <span className="text-gray-300 text-xs sm:text-sm font-mono">
                {student.matricNumber}
              </span>
            </div>

            {/* Badges on right matching s2.png */}
            <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0">
              <span className="bg-[#38205c] border border-white/10 text-white/90 text-xs font-semibold px-3 py-1 rounded-md">
                {student.nucStatus}
              </span>
              <span className="bg-[#38205c] border border-white/10 text-white/90 text-xs font-semibold px-3 py-1 rounded-md">
                {student.level}
              </span>
            </div>
          </div>

          {/* Department & Faculty with building icon */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
            <HiOutlineBuildingOffice2 className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="font-medium text-white">{student.department}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{student.faculty}</span>
          </div>

          {/* Contact Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300 pt-0.5">
            <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <FiMail className="w-4 h-4 text-gray-400" />
              <span>{student.email}</span>
            </span>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <FiPhone className="w-4 h-4 text-gray-400" />
              <span>{student.phone}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
