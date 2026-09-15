import type { FC } from 'react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiChevronDown, FiX, FiArrowUpRight, FiCheckCircle } from 'react-icons/fi'
import { fadeInUp } from '../../utils/motion'

export interface AcademicProgramItem {
  id: string
  course: string
  certification: string
  faculty: string
  level: 'Undergraduate' | 'Postgraduate'
  duration: string
  description: string
  careers: string[]
}

const PROGRAMMES_DATA: AcademicProgramItem[] = [
  {
    id: 'cs',
    course: 'Computer Science',
    certification: 'B.Sc. Computer Science',
    faculty: 'Faculty of Computing',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'A rigorous computational discipline exploring algorithmic theory, artificial intelligence, software architecture, distributed systems, and modern computing engineering.',
    careers: ['Software Architect', 'AI/ML Engineer', 'Full-Stack Developer', 'Systems Researcher'],
  },
  {
    id: 'cyber',
    course: 'Cyber Security',
    certification: 'B.Sc. Cyber Security',
    faculty: 'Faculty of Computing',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Comprehensive training in cryptographic protocols, defensive network architectures, vulnerability assessment, penetration testing, and enterprise digital forensics.',
    careers: ['Security Analyst', 'Penetration Tester', 'Chief Information Security Officer', 'Forensics Specialist'],
  },
  {
    id: 'se',
    course: 'Software Engineering',
    certification: 'B.Sc. Software Engineering',
    faculty: 'Faculty of Computing',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Focused on enterprise application development, Agile methodologies, cloud computing platforms, automated QA, and high-performance engineering pipelines.',
    careers: ['Lead Software Engineer', 'DevOps Specialist', 'Cloud Systems Architect', 'Product Engineer'],
  },
  {
    id: 'ds',
    course: 'Data Science',
    certification: 'B.Sc. Data Science',
    faculty: 'Faculty of Computing',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Advanced study of statistical modelling, predictive analytics, deep neural networks, big data infrastructures, and data-driven strategic decision intelligence.',
    careers: ['Data Scientist', 'Machine Learning Engineer', 'Quantitative Analyst', 'Big Data Architect'],
  },
  {
    id: 'ph',
    course: 'Public Health',
    certification: 'B.Sc. Public Health',
    faculty: 'Faculty of Allied and Health Sciences',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Community healthcare delivery, epidemiological outbreak tracking, environmental hygiene, health policy drafting, and preventative wellness strategy.',
    careers: ['Epidemiologist', 'Public Health Consultant', 'Health Policy Officer', 'NGO Health Lead'],
  },
  {
    id: 'him',
    course: 'Health Information Management',
    certification: 'B.HIM – Bachelor of Health Information Management',
    faculty: 'Faculty of Allied and Health Sciences',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Integration of clinical informatics, electronic medical health record systems, biomedical data governance, and regulatory compliance standards.',
    careers: ['Clinical Informatics Lead', 'Health Data Manager', 'Hospital Compliance Director', 'Health IT Consultant'],
  },
  {
    id: 'hca',
    course: 'Health Care Administration and Hospital Management',
    certification: 'B.Sc. Health Care Administration and Hospital Management',
    faculty: 'Faculty of Allied and Health Sciences',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Executive healthcare leadership, clinical operational workflows, hospital financial administration, healthcare law, and patient experience optimization.',
    careers: ['Hospital Administrator', 'Clinical Operations Manager', 'Healthcare Consultant', 'Medical Facility Director'],
  },
  {
    id: 'acc',
    course: 'Accounting',
    certification: 'B.Sc. Accounting',
    faculty: 'Faculty of Management and Social Sciences',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Corporate financial reporting, forensic accounting, international taxation frameworks, managerial audits, and financial governance standards.',
    careers: ['Chartered Accountant', 'Forensic Auditor', 'Financial Controller', 'Tax Strategist'],
  },
  {
    id: 'econ',
    course: 'Economics',
    certification: 'B.Sc. Economics',
    faculty: 'Faculty of Management and Social Sciences',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Macroeconomic fiscal strategy, quantitative econometric forecasting, market behaviour modelling, financial market dynamics, and international trade policy.',
    careers: ['Economic Policy Analyst', 'Investment Banker', 'Market Risk Consultant', 'Development Economist'],
  },
  {
    id: 'bus',
    course: 'Business Administration',
    certification: 'B.Sc. Business Administration',
    faculty: 'Faculty of Management and Social Sciences',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Strategic corporate leadership, international venture development, organizational transformation, brand management, and global commercial trade.',
    careers: ['Business Strategist', 'Operations Director', 'Management Consultant', 'Corporate Venture Founder'],
  },
  {
    id: 'crim',
    course: 'Criminology, Security and Conflict Studies',
    certification: 'B.Sc. Criminology, Security and Conflict Studies',
    faculty: 'Faculty of Management and Social Sciences',
    level: 'Undergraduate',
    duration: '4 Years Full-Time',
    description:
      'Investigation of criminological theory, forensic behavioural analysis, geopolitical peacebuilding, intelligence gathering, and security policy.',
    careers: ['Intelligence Analyst', 'Security Policy Advisor', 'Conflict Resolution Specialist', 'Forensic Criminologist'],
  },
]

const FACULTIES_LIST = [
  'All Faculties',
  'Faculty of Computing',
  'Faculty of Allied and Health Sciences',
  'Faculty of Management and Social Sciences',
]

export const AcademicProgrammesTableSection: FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('All Faculties')
  const [selectedLevel, setSelectedLevel] = useState<'Undergraduate' | 'Postgraduate' | 'All'>('Undergraduate')
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<AcademicProgramItem | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close faculty dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFacultyDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter programmes based on keyword search, faculty, and level
  const filteredProgrammes = useMemo(() => {
    return PROGRAMMES_DATA.filter((prog) => {
      // Level filter
      if (selectedLevel !== 'All' && prog.level !== selectedLevel) {
        return false
      }

      // Faculty filter
      if (selectedFaculty !== 'All Faculties' && prog.faculty !== selectedFaculty) {
        return false
      }

      // Keyword search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchesCourse = prog.course.toLowerCase().includes(query)
        const matchesCert = prog.certification.toLowerCase().includes(query)
        const matchesFaculty = prog.faculty.toLowerCase().includes(query)
        const matchesDesc = prog.description.toLowerCase().includes(query)
        if (!matchesCourse && !matchesCert && !matchesFaculty && !matchesDesc) {
          return false
        }
      }

      return true
    })
  }, [searchQuery, selectedFaculty, selectedLevel])

  return (
    <section className="w-full bg-[#FDE88C] py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 sm:gap-10 md:gap-12">
        {/* Section Heading */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-40px' }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-normal leading-[1.2] text-black tracking-[-0.01em]">
            Academic Programmes
          </h2>
        </motion.div>

        {/* Filter Controls Row */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-40px' }}
          className="flex flex-wrap items-center gap-3 sm:gap-4"
        >
          {/* Level Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedLevel('Undergraduate')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedLevel === 'Undergraduate'
                  ? 'bg-[#141416] text-white shadow-md'
                  : 'bg-transparent border border-black/40 text-black hover:border-black'
              }`}
            >
              Undergraduate
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('Postgraduate')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedLevel === 'Postgraduate'
                  ? 'bg-[#141416] text-white shadow-md'
                  : 'bg-transparent border border-black/40 text-black hover:border-black'
              }`}
            >
              Postgraduate
            </button>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-[1px] bg-black/20 mx-1" />

          {/* Search Input Pill */}
          <div className="relative min-w-[220px] sm:min-w-[260px] flex-1 max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter keyword"
              className="w-full rounded-full border border-black/50 bg-transparent px-5 py-2.5 pr-10 text-xs sm:text-sm text-black placeholder:text-black/60 focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
              >
                <FiX className="w-4 h-4" />
              </button>
            ) : (
              <FiSearch className="w-4 h-4 text-black/70 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            )}
          </div>

          {/* Faculty Dropdown Pill */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsFacultyDropdownOpen((prev) => !prev)}
              className="rounded-full border border-black/50 bg-transparent px-5 py-2.5 text-xs sm:text-sm text-black focus:outline-none focus:border-black flex items-center justify-between gap-3 sm:gap-4 transition-colors cursor-pointer"
            >
              <span>{selectedFaculty}</span>
              <FiChevronDown
                className={`w-4 h-4 text-black transition-transform duration-200 ${
                  isFacultyDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isFacultyDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 bg-white rounded-2xl shadow-xl shadow-black/15 border border-black/10 p-2 z-30 overflow-hidden"
                >
                  {FACULTIES_LIST.map((faculty) => (
                    <button
                      key={faculty}
                      type="button"
                      onClick={() => {
                        setSelectedFaculty(faculty)
                        setIsFacultyDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-between cursor-pointer ${
                        selectedFaculty === faculty
                          ? 'bg-[#141416] text-white font-medium'
                          : 'text-black hover:bg-black/5'
                      }`}
                    >
                      <span>{faculty}</span>
                      {selectedFaculty === faculty && <FiCheckCircle className="w-3.5 h-3.5 text-[#FDE88C]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Programmes Table / List */}
        <div className="w-full flex flex-col mt-4">
          {/* Table Column Headers */}
          <div className="w-full pb-3 border-b border-black/80 flex items-center justify-between text-xs font-semibold tracking-wider text-black uppercase">
            <span>COURSE</span>
            <span>CERTIFICATION</span>
          </div>

          {/* Table Rows */}
          <div className="w-full flex flex-col divide-y divide-black/30">
            <AnimatePresence mode="popLayout">
              {filteredProgrammes.length > 0 ? (
                filteredProgrammes.map((program) => (
                  <motion.div
                    key={program.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setSelectedProgram(program)}
                    className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 group hover:bg-black/[0.04] px-2 sm:px-3 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    {/* Course Title */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl sm:text-2xl md:text-[25px] font-heading font-normal text-black tracking-[-0.01em] group-hover:translate-x-1.5 transition-transform duration-200">
                        {program.course}
                      </h3>
                    </div>

                    {/* Certification */}
                    <div className="flex items-center sm:justify-end gap-3">
                      <span className="text-sm sm:text-base md:text-[17px] font-sans text-black/90 font-normal sm:text-right">
                        {program.certification}
                      </span>
                      <div className="w-7 h-7 rounded-full border border-black/30 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 group-hover:border-black transition-all shrink-0">
                        <FiArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                /* Empty Results State */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center flex flex-col items-center justify-center gap-4"
                >
                  <p className="text-lg font-heading text-black font-normal">
                    No academic programmes found matching your filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedFaculty('All Faculties')
                      setSelectedLevel('All')
                    }}
                    className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Interactive Course Details Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Faculty & Level Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#200441] text-white text-xs font-medium">
                  {selectedProgram.faculty}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#FDE88C] text-black text-xs font-medium">
                  {selectedProgram.level} • {selectedProgram.duration}
                </span>
              </div>

              {/* Course Title & Degree */}
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-normal text-black leading-tight">
                  {selectedProgram.course}
                </h3>
                <p className="text-base sm:text-lg font-medium text-black/70 mt-1">
                  {selectedProgram.certification}
                </p>
              </div>

              {/* Overview Description */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">
                  Curriculum & Programme Overview
                </h4>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Career Pathways */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2.5">
                  Career Pathways & Opportunities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProgram.careers.map((career) => (
                    <span
                      key={career}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-black text-xs sm:text-sm font-normal"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <a
                  href="/portals"
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#200441] text-white text-center text-sm font-medium hover:bg-black transition-colors"
                >
                  Apply for Admission
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="py-3.5 px-6 rounded-full border border-black/30 text-black text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
