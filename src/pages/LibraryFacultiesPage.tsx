import { type FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  FiBook,
  FiArrowRight,
  FiCompass,
  FiSearch,
} from 'react-icons/fi'
import { HiAcademicCap, HiSparkles } from 'react-icons/hi2'
import { LibraryDashboardLayout } from '../components/library/dashboard/LibraryDashboardLayout'
import { useLibraryFilter } from '../context/LibraryFilterContext'
import { getFacultyDetailedStats, LOCAL_BOOKS_LIBRARY } from '../utils/bookScanner'
import { BookCover } from '../components/library/BookCover'

export const LibraryFacultiesPage: FC = () => {
  const navigate = useNavigate()
  const { setSelectedFaculty, setSelectedDept, setSelectedCoreArea } = useLibraryFilter()
  const [searchTerm, setSearchTerm] = useState('')

  const facultyStats = getFacultyDetailedStats()
  const totalDepartments = facultyStats.reduce((sum, f) => sum + f.departments.length, 0)

  // Filter faculties & departments based on search term
  const filteredFacultyStats = facultyStats
    .map((fac) => {
      const q = searchTerm.toLowerCase().trim()
      if (!q) return fac

      const facMatches = fac.faculty.toLowerCase().includes(q)
      const matchingDepts = fac.departments.filter(
        (dept) =>
          facMatches ||
          dept.name.toLowerCase().includes(q) ||
          dept.coreAreas.some((area) => area.toLowerCase().includes(q))
      )

      return {
        ...fac,
        departments: matchingDepts,
      }
    })
    .filter((fac) => fac.departments.length > 0)

  const handleExploreDepartment = (facultyName: string, deptName: string) => {
    setSelectedFaculty(facultyName)
    setSelectedDept(deptName)
    setSelectedCoreArea('All Areas')
    navigate('/library/dashboard')
  }

  const handleExploreFaculty = (facultyName: string) => {
    setSelectedFaculty(facultyName)
    setSelectedDept('All Departments')
    setSelectedCoreArea('All Areas')
    navigate('/library/dashboard')
  }

  return (
    <LibraryDashboardLayout>
      <Helmet>
        <title>Faculties & Academic Sections | Pearl University e-Library</title>
        <meta
          name="description"
          content="Explore Pearl University faculties, academic departments, core subject areas, and university textbook collections."
        />
      </Helmet>



      <div className="max-w-[1600px] mx-auto flex flex-col gap-8 pb-16">
        {/* ── HERO BANNER ──────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B0A37] via-[#200441] to-[#3B1566] text-white p-6 sm:p-8 md:p-10 shadow-xl border border-white/10">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-[#FDE88C]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FDE88C] text-xs font-semibold mb-3 border border-white/10">
                <HiSparkles className="w-3.5 h-3.5" />
                <span>ACADEMIC DIVISIONS & STRUCTURE</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
                Faculties & Departmental Sections
              </h1>
              <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
                Discover accredited degree curricula, specialized research disciplines, and direct access to university textbooks across all 3 academic faculties.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 shrink-0 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <div className="text-center px-2">
                <span className="block font-heading text-xl sm:text-2xl font-bold text-[#FDE88C]">
                  {facultyStats.length}
                </span>
                <span className="text-[10px] sm:text-[11px] text-white/60 uppercase tracking-wider font-mono">
                  Faculties
                </span>
              </div>
              <div className="text-center px-2 border-x border-white/10">
                <span className="block font-heading text-xl sm:text-2xl font-bold text-white">
                  {totalDepartments}
                </span>
                <span className="text-[10px] sm:text-[11px] text-white/60 uppercase tracking-wider font-mono">
                  Departments
                </span>
              </div>
              <div className="text-center px-2">
                <span className="block font-heading text-xl sm:text-2xl font-bold text-white">
                  {LOCAL_BOOKS_LIBRARY.length}
                </span>
                <span className="text-[10px] sm:text-[11px] text-white/60 uppercase tracking-wider font-mono">
                  Textbooks
                </span>
              </div>
            </div>
          </div>

          {/* Search Filter Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 relative max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty, department, or discipline..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#FDE88C]/50 transition"
            />
          </div>
        </div>

        {/* ── FACULTY SECTIONS BREAKDOWN ──────────────────────── */}
        <div className="space-y-10">
          {filteredFacultyStats.map((fac, fIdx) => (
            <motion.section
              key={fac.faculty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: fIdx * 0.08 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs flex flex-col gap-6"
            >
              {/* Faculty Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#ECE0EF] text-[#200441] flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                    <HiAcademicCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-medium text-gray-950">
                      {fac.faculty}
                    </h2>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {fac.departments.length} Academic Departments • {fac.totalBooks} Textbooks Indexed
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleExploreFaculty(fac.faculty)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ECE0EF] hover:bg-[#200441] text-[#200441] hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <span>Explore Faculty Collection</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Department Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {fac.departments.map((dept) => (
                  <div
                    key={dept.name}
                    className="bg-[#FAF7FB] rounded-2xl p-5 border border-black/5 hover:border-[#200441]/20 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Tag & Book Count */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#200441] bg-[#ECE0EF] px-2.5 py-1 rounded-md">
                          Department
                        </span>
                        <span className="text-xs font-mono font-medium text-gray-500 flex items-center gap-1">
                          <FiBook className="w-3 h-3 text-purple-600" />
                          {dept.bookCount} books
                        </span>
                      </div>

                      {/* Department Title */}
                      <h3 className="font-heading font-medium text-base text-gray-900 group-hover:text-[#200441] transition-colors leading-snug">
                        {dept.name}
                      </h3>

                      {/* Core Subject Disciplines Chips */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {dept.coreAreas.slice(0, 4).map((area) => (
                          <span
                            key={area}
                            className="text-[10px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md truncate max-w-[190px]"
                            title={area}
                          >
                            {area}
                          </span>
                        ))}
                        {dept.coreAreas.length > 4 && (
                          <span className="text-[10px] bg-purple-100 text-[#200441] font-mono px-1.5 py-0.5 rounded-md font-semibold">
                            +{dept.coreAreas.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Sample Covers Preview Strip */}
                      <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-2 overflow-hidden">
                        {dept.sampleBooks.map((sampleBook) => (
                          <button
                            key={sampleBook.id}
                            type="button"
                            onClick={() => navigate(`/library/dashboard/book/${sampleBook.id}`)}
                            className="w-12 h-16 shrink-0 rounded-lg overflow-hidden border border-black/10 hover:scale-105 transition-transform shadow-xs cursor-pointer"
                            title={`View "${sampleBook.title}"`}
                          >
                            <BookCover
                              pdfUrl={sampleBook.fileUrl}
                              title={sampleBook.title}
                              author={sampleBook.author}
                              aspectRatio="aspect-[3/4]"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleExploreDepartment(fac.faculty, dept.name)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#200441] group-hover:text-[#381561] hover:underline cursor-pointer"
                      >
                        <span>View All {dept.bookCount} Books</span>
                        <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}

          {filteredFacultyStats.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-black/5 shadow-xs max-w-lg mx-auto">
              <FiCompass className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-medium text-gray-900">
                No matching academic sections found
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Try searching for general keywords like "Computer", "Health", or "Management".
              </p>
            </div>
          )}
        </div>
      </div>
    </LibraryDashboardLayout>
  )
}
