import type { FC } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone } from 'react-icons/fi'
import { HiOutlineCreditCard } from 'react-icons/hi2'
import studentAvatarImg from '../../../assets/images/student-portal/john_offiong.jpg'
import { STUDENT_PROFILE_DATA } from '../../../data/studentData'
import { useUI } from '../../../context/UIContext'

export interface StudentProfileHeroProps {
  onPaySchoolFees?: () => void
}

export const StudentProfileHero: FC<StudentProfileHeroProps> = ({ onPaySchoolFees }) => {
  const { alert } = useUI()
  const student = STUDENT_PROFILE_DATA

  const handlePay = () => {
    if (onPaySchoolFees) {
      onPaySchoolFees()
    } else {
      alert.info(
        'Tuition Payment Gateway',
        'Initiating payment gateway for Session 2025/2026 Level 100 School Fees (₦200,000.00).'
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1b0a33]/80 border border-[#3b1f66] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden backdrop-blur-md"
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-8">
        {/* Left Sub-Group: Circular Photo + Meta Information */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-auto">
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

          {/* Student Credentials & Badges */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
            {/* Name and IDs */}
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

            {/* Badges Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
              <span className="bg-[#38205c] border border-white/10 text-white/90 text-xs font-semibold px-3 py-1 rounded-md">
                {student.nucStatus}
              </span>
              <span className="bg-[#38205c] border border-white/10 text-white/90 text-xs font-semibold px-3 py-1 rounded-md">
                {student.level}
              </span>
              <span className="bg-[#38205c] border border-white/10 text-white/90 text-xs font-semibold px-3 py-1 rounded-md">
                {student.faculty}
              </span>
              <span className="bg-[#38205c] border border-white/10 text-white/90 text-xs font-semibold px-3 py-1 rounded-md">
                {student.department}
              </span>
            </div>

            {/* Contact Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300 pt-1">
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

            {/* Academic Progress Bar */}
            <div className="w-full max-w-md pt-2">
              <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5 font-medium">
                <span>Academic Progress</span>
                <span className="font-mono text-gray-200">{student.academicProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${student.academicProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA: Pay School Fees Button */}
        <div className="w-full sm:w-auto flex justify-center lg:justify-end shrink-0 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={handlePay}
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#FDE88C] hover:bg-[#FFE57A] text-[#160829] font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <HiOutlineCreditCard className="w-5 h-5 text-[#160829]" />
            <span>Pay School Fees</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
