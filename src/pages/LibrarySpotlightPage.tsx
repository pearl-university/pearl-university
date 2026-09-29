import { type FC, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  FiBook,
  FiArrowRight,
  FiAward,
  FiCheckCircle,
} from 'react-icons/fi'
import { HiSparkles, HiAcademicCap } from 'react-icons/hi2'
import { LibraryDashboardLayout } from '../components/library/dashboard/LibraryDashboardLayout'
import { useLibraryFilter } from '../context/LibraryFilterContext'
import { LOCAL_BOOKS_LIBRARY, getUniqueDepartments } from '../utils/bookScanner'
import { BookCard } from '../components/library/BookCard'

// Departmental spotlight curriculum definitions
interface DepartmentCurriculumMeta {
  department: string
  faculty: string
  degree: string
  overview: string
  pillars: string[]
}

const DEPARTMENT_METAS: Record<string, DepartmentCurriculumMeta> = {
  'Computer Science': {
    department: 'Computer Science',
    faculty: 'Faculty of Computing',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Equips students with rigorous foundations in computation theory, algorithm design, systems software, database management, and advanced artificial intelligence.',
    pillars: ['Algorithms & Data Structures', 'Operating Systems & Networks', 'Database Management', 'Artificial Intelligence & ML'],
  },
  'B.SC Computer Science': {
    department: 'Computer Science',
    faculty: 'Faculty of Computing',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Equips students with rigorous foundations in computation theory, algorithm design, systems software, database management, and advanced artificial intelligence.',
    pillars: ['Algorithms & Data Structures', 'Operating Systems & Networks', 'Database Management', 'Artificial Intelligence & ML'],
  },
  'Cyber Security': {
    department: 'Cyber Security',
    faculty: 'Faculty of Computing',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Comprehensive training in cryptographic protocols, defensive network architectures, vulnerability assessment, penetration testing, and enterprise digital forensics.',
    pillars: ['Network Defense & Cryptography', 'Ethical Hacking & Forensics', 'Threat Intelligence', 'Security Governance & Compliance'],
  },
  'Software Engineering': {
    department: 'Software Engineering',
    faculty: 'Faculty of Computing',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Focuses on enterprise application development, Agile methodologies, cloud computing platforms, automated QA, and high-performance engineering pipelines.',
    pillars: ['Software Architecture & Design', 'Cloud Infrastructure & DevOps', 'Agile Product Lifecycle', 'Quality Assurance & Testing'],
  },
  'Data Science': {
    department: 'Data Science',
    faculty: 'Faculty of Computing',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Advanced study of statistical modelling, predictive analytics, deep neural networks, big data infrastructures, and data-driven strategic decision intelligence.',
    pillars: ['Statistical Modelling', 'Machine Learning & Deep Learning', 'Big Data Engineering', 'Predictive Analytics'],
  },
  'Public Health': {
    department: 'Public Health',
    faculty: 'Faculty of Allied and Health Sciences',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Focuses on community healthcare delivery, epidemiological outbreak tracking, environmental hygiene, health policy drafting, and preventative wellness strategy.',
    pillars: ['Epidemiology & Biostatistics', 'Global Health Policy', 'Environmental Health', 'Disease Prevention & Control'],
  },
  'Health Information Management': {
    department: 'Health Information Management',
    faculty: 'Faculty of Allied and Health Sciences',
    degree: 'Bachelor of Health Information Management (B.HIM)',
    overview: 'Integration of clinical informatics, electronic medical health record systems, biomedical data governance, and regulatory compliance standards.',
    pillars: ['Clinical Informatics', 'Health Data Governance', 'Medical Records Systems', 'Healthcare Analytics'],
  },
  'Health Care Administration and Hospital Management': {
    department: 'Health Care Administration and Hospital Management',
    faculty: 'Faculty of Allied and Health Sciences',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Executive healthcare leadership, clinical operational workflows, hospital financial administration, healthcare law, and patient experience optimization.',
    pillars: ['Clinical Operations Management', 'Healthcare Informatics', 'Hospital Administration', 'Executive Leadership'],
  },
  'Accounting and Finance': {
    department: 'Accounting and Finance',
    faculty: 'Faculty of Management and Social Sciences',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Corporate financial reporting, forensic accounting, international taxation frameworks, managerial audits, and financial governance standards.',
    pillars: ['Financial Accounting', 'Corporate Finance', 'Taxation & Auditing', 'Forensic Accounting'],
  },
  'Business Administration': {
    department: 'Business Administration',
    faculty: 'Faculty of Management and Social Sciences',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Strategic corporate leadership, quantitative decision modeling, enterprise resource planning, operational optimization, and international commercial trade.',
    pillars: ['Operations Research & Analytics', 'Strategic Management', 'Organizational Leadership', 'Corporate Innovation'],
  },
  'Economics': {
    department: 'Economics',
    faculty: 'Faculty of Management and Social Sciences',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Macroeconomic fiscal strategy, quantitative econometric forecasting, market behaviour modelling, financial market dynamics, and international trade policy.',
    pillars: ['Micro & Macroeconomics', 'Econometrics & Quantitative Analysis', 'Development Economics', 'International Trade Policy'],
  },
  'Criminology, Security and Conflict Studies': {
    department: 'Criminology, Security and Conflict Studies',
    faculty: 'Faculty of Management and Social Sciences',
    degree: 'Bachelor of Science (B.Sc)',
    overview: 'Investigation of criminological theory, forensic behavioural analysis, geopolitical peacebuilding, intelligence gathering, and security policy.',
    pillars: ['Criminological Theory', 'Forensic Crime Investigation', 'Conflict Resolution & Peacebuilding', 'Global Security Policy'],
  },
}

export const LibrarySpotlightPage: FC = () => {
  const navigate = useNavigate()
  const { setSelectedFaculty, setSelectedDept, setSelectedCoreArea } = useLibraryFilter()
  
  const allDepartments = useMemo(() => getUniqueDepartments(), [])
  const [selectedDeptName, setSelectedDeptName] = useState(allDepartments[0] || 'B.SC Computer Science')

  // Find department books
  const departmentBooks = useMemo(() => {
    return LOCAL_BOOKS_LIBRARY.filter((b) => b.department === selectedDeptName)
  }, [selectedDeptName])

  // Core subject disciplines in department
  const coreDisciplines = useMemo(() => {
    return Array.from(new Set(departmentBooks.map((b) => b.coreArea))).sort()
  }, [departmentBooks])

  const meta = DEPARTMENT_METAS[selectedDeptName] || {
    department: selectedDeptName,
    faculty: departmentBooks[0]?.faculty || 'Pearl University Faculty',
    degree: 'Bachelor of Science (B.Sc)',
    overview: `Comprehensive academic department offering core curriculum research and professional training across ${coreDisciplines.length} subject disciplines.`,
    pillars: coreDisciplines.slice(0, 4),
  }

  const handleJumpToCatalogue = () => {
    setSelectedFaculty(meta.faculty)
    setSelectedDept(selectedDeptName)
    setSelectedCoreArea('All Areas')
    navigate('/library/dashboard')
  }

  return (
    <LibraryDashboardLayout>
      <Helmet>
        <title>Departmental Curricula Spotlight | Pearl University e-Library</title>
        <meta
          name="description"
          content="Explore academic curricula roadmaps, core foundation textbooks, and learning pillars across Pearl University departments."
        />
      </Helmet>

      <div className="max-w-[1600px] mx-auto flex flex-col gap-8 pb-16">
        {/* ── HERO BANNER ──────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B0A37] via-[#2E0B59] to-[#45106E] text-white p-6 sm:p-8 md:p-10 shadow-xl border border-white/10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FDE88C] text-xs font-semibold mb-3 border border-white/10">
              <HiSparkles className="w-3.5 h-3.5" />
              <span>CURRICULAR SPOTLIGHT</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
              Departmental Spotlight & Study Tracks
            </h1>
            <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
              Explore university study tracks, foundational core readings, and academic competencies designed for excellence in research and industry.
            </p>
          </div>
        </div>

        {/* ── DEPARTMENT SELECTOR TABS ────────────────────────── */}
        <div className="bg-white rounded-2xl p-2.5 border border-black/5 shadow-xs flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {allDepartments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDeptName(dept)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                selectedDeptName === dept
                  ? 'bg-[#200441] text-white shadow-md font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <HiAcademicCap className="w-4 h-4 text-[#FDE88C]" />
              <span>{dept}</span>
            </button>
          ))}
        </div>

        {/* ── SELECTED DEPARTMENT DEEP DIVE ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Overview & Pillars Card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#200441] bg-[#ECE0EF] px-3 py-1 rounded-lg font-semibold w-fit mb-3">
                  <FiAward className="w-3.5 h-3.5" />
                  <span>{meta.degree}</span>
                </div>

                <h2 className="font-heading text-xl sm:text-2xl font-medium text-gray-950">
                  {meta.department}
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  {meta.faculty}
                </p>

                <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed">
                  {meta.overview}
                </p>

                {/* Learning Pillars */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h4 className="text-xs font-mono uppercase text-gray-400 font-semibold tracking-wider mb-3">
                    Academic Curriculum Pillars:
                  </h4>
                  <div className="space-y-2">
                    {meta.pillars.map((pillar) => (
                      <div key={pillar} className="flex items-start gap-2.5 text-xs text-gray-800">
                        <FiCheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>{pillar}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Disciplines count */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h4 className="text-xs font-mono uppercase text-gray-400 font-semibold tracking-wider mb-2.5">
                    Core Subject Disciplines ({coreDisciplines.length}):
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {coreDisciplines.map((area) => (
                      <span
                        key={area}
                        className="text-[10px] bg-[#FAF7FB] border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Browse in Feed CTA */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleJumpToCatalogue}
                  className="w-full py-3 px-4 rounded-xl bg-[#200441] hover:bg-[#35145D] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <FiBook className="w-4 h-4" />
                  <span>Browse All {departmentBooks.length} Books in Feed</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Department Books Spotlight Grid */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg sm:text-xl font-medium text-gray-950">
                  Essential Curriculum Textbooks
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  Showing cornerstone reference textbooks for {selectedDeptName}
                </p>
              </div>
              <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg font-semibold">
                {departmentBooks.length} titles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departmentBooks.slice(0, 8).map((book, idx) => (
                <BookCard key={book.id} book={book} index={idx} />
              ))}
            </div>

            {departmentBooks.length > 8 && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleJumpToCatalogue}
                  className="px-5 py-2.5 rounded-xl bg-white border border-black/10 hover:bg-[#FAF7FB] text-[#200441] text-xs font-semibold shadow-2xs transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>View Remaining {departmentBooks.length - 8} Department Titles</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LibraryDashboardLayout>
  )
}
