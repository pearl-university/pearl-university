import type { FC } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineAcademicCap } from 'react-icons/hi2'
import { STUDENT_COURSES_DATA } from '../../../data/studentData'
import { useUI } from '../../../context/UIContext'

export const CoursesTableCard: FC = () => {
  const { alert } = useUI()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full bg-[#1b0a33]/80 border border-[#3b1f66] rounded-[24px] p-6 sm:p-7 text-white shadow-xl backdrop-blur-md overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#38205c] border border-white/10 flex items-center justify-center text-gray-200">
            <HiOutlineAcademicCap className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Courses</h3>
        </div>
        <button
          type="button"
          onClick={() => alert.info('Course Catalog', 'Viewing complete registered curriculum.')}
          className="text-xs text-gray-400 hover:text-white transition-colors font-medium cursor-pointer"
        >
          View all
        </button>
      </div>

      {/* Courses Table */}
      <div className="mt-5 overflow-x-auto custom-scrollbar rounded-xl border border-white/15">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[580px]">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-white/15 bg-[#230f3f] text-gray-200">
              <th className="py-3.5 px-4 font-semibold w-16 text-center border-r border-white/10">
                NO.
              </th>
              <th className="py-3.5 px-5 font-semibold border-r border-white/10">
                Title
              </th>
              <th className="py-3.5 px-4 font-semibold text-center w-28 border-r border-white/10">
                Code
              </th>
              <th className="py-3.5 px-4 font-semibold text-center w-20 border-r border-white/10">
                Unit
              </th>
              <th className="py-3.5 px-4 font-semibold text-center w-20">
                Status
              </th>
            </tr>
          </thead>

          {/* Table Body with alternating Yellow / Dark Purple rows */}
          <tbody className="divide-y divide-white/10 font-medium">
            {STUDENT_COURSES_DATA.map((course) => {
              const isHighlighted = course.no % 2 !== 0 // 1, 3, 5, 7 are yellow in s1.png

              return (
                <tr
                  key={course.code}
                  className={`transition-colors ${
                    isHighlighted
                      ? 'bg-[#FDE88C] text-[#160829] hover:bg-[#ffe680]'
                      : 'bg-[#1b0a33] text-white hover:bg-[#251044]'
                  }`}
                >
                  <td
                    className={`py-3 px-4 text-center font-bold border-r ${
                      isHighlighted ? 'border-[#e6d075]' : 'border-white/10'
                    }`}
                  >
                    {course.no}
                  </td>
                  <td
                    className={`py-3 px-5 font-bold tracking-tight uppercase border-r ${
                      isHighlighted ? 'border-[#e6d075]' : 'border-white/10'
                    }`}
                  >
                    {course.title}
                  </td>
                  <td
                    className={`py-3 px-4 text-center font-mono font-bold border-r ${
                      isHighlighted ? 'border-[#e6d075]' : 'border-white/10'
                    }`}
                  >
                    {course.code}
                  </td>
                  <td
                    className={`py-3 px-4 text-center font-bold border-r ${
                      isHighlighted ? 'border-[#e6d075]' : 'border-white/10'
                    }`}
                  >
                    {course.unit}
                  </td>
                  <td className="py-3 px-4 text-center font-bold">
                    {course.status}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
