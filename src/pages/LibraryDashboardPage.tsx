import { type FC, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  FiBookOpen,
  FiEye,
  FiSearch,
  FiSliders,
  FiX,
  FiChevronDown,
  FiRotateCcw,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { LibraryDashboardLayout } from '../components/library/dashboard/LibraryDashboardLayout'
import { useLibraryFilter, type BookSortOption } from '../context/LibraryFilterContext'
import { useLibraryContext } from '../context/LibraryContext'
import { BookCard } from '../components/library/BookCard'
import { BookCover } from '../components/library/BookCover'

export const LibraryDashboardPage: FC = () => {
  const navigate = useNavigate()
  const {
    filteredBooks,
    allBooks,
    selectedFaculty,
    setSelectedFaculty,
    availableFaculties,
    selectedDept,
    setSelectedDept,
    availableDepartments,
    selectedCoreArea,
    setSelectedCoreArea,
    availableCoreAreas,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    resetFilters,
    totalBooksCount,
  } = useLibraryFilter()

  const { openReader, readingHistory } = useLibraryContext()
  const [displayLimit, setDisplayLimit] = useState(24)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Reset display limit when filter or search query changes
  const activeFilterKey = `${selectedFaculty}-${selectedDept}-${selectedCoreArea}-${searchQuery}-${sortBy}`
  const visibleBooks = useMemo(() => {
    return filteredBooks.slice(0, displayLimit)
  }, [filteredBooks, displayLimit])

  // Count active non-default filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchQuery.trim()) count++
    if (selectedFaculty !== 'All Faculties') count++
    if (selectedDept !== 'All Departments') count++
    if (selectedCoreArea !== 'All Areas') count++
    if (sortBy !== 'default') count++
    return count
  }, [searchQuery, selectedFaculty, selectedDept, selectedCoreArea, sortBy])

  return (
    <LibraryDashboardLayout>
      <Helmet>
        <title>e-Library Catalogue | Pearl University</title>
        <meta
          name="description"
          content={`Access ${totalBooksCount} university textbooks across all faculties and academic departments at Pearl University.`}
        />
      </Helmet>

      <div className="max-w-[1600px] mx-auto flex flex-col gap-6 pb-16" key={activeFilterKey}>
        {/* ── CATALOGUE HERO BANNER ───────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B0A37] via-[#200441] to-[#3B1566] text-white p-6 sm:p-8 md:p-10 shadow-xl border border-white/10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FDE88C] text-xs font-semibold mb-3 border border-white/10">
              <HiSparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL ACADEMIC REPOSITORY • {totalBooksCount} TEXTBOOKS</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
              Academic Textbook Catalogue
            </h1>
            <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
              Explore university textbooks prescribed for coursework, examination preparation, and academic research across all faculties and departments.
            </p>
          </div>
        </div>

        {/* ── CONTINUE READING SHELF (IF ACTIVE) ──────────────── */}
        {readingHistory.length > 0 && !searchQuery && (
          <div className="bg-gradient-to-r from-[#1B0A37] to-[#2E0B59] rounded-2xl p-4 sm:p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10">
            <div className="flex items-center gap-4 min-w-0">
              <button
                type="button"
                onClick={() => navigate(`/library/dashboard/book/${readingHistory[0].book.id}`)}
                className="w-12 h-16 shrink-0 hidden sm:block rounded-lg overflow-hidden border border-white/20 hover:scale-105 transition-transform cursor-pointer shadow-xs"
                title={`View details for "${readingHistory[0].book.title}"`}
              >
                <BookCover
                  pdfUrl={readingHistory[0].book.fileUrl}
                  title={readingHistory[0].book.title}
                  author={readingHistory[0].book.author}
                  aspectRatio="aspect-[3/4]"
                />
              </button>
              <div
                className="min-w-0 cursor-pointer group"
                onClick={() => navigate(`/library/dashboard/book/${readingHistory[0].book.id}`)}
              >
                <div className="flex items-center gap-2 text-xs text-[#FDE88C] font-semibold mb-1">
                  <HiSparkles className="w-3.5 h-3.5" />
                  <span>CONTINUE READING</span>
                </div>
                <h3 className="font-heading font-medium text-base sm:text-lg text-white group-hover:text-[#FDE88C] transition-colors truncate">
                  {readingHistory[0].book.title}
                </h3>
                <p className="text-xs text-white/70 truncate">
                  {readingHistory[0].book.author} • Page {readingHistory[0].progress.page} of {readingHistory[0].progress.totalPages}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openReader(readingHistory[0].book)}
              className="px-5 py-2.5 rounded-xl bg-[#FDE88C] hover:bg-[#fde16e] text-[#1B0A37] font-semibold text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiEye className="w-4 h-4" />
              <span>Resume Page {readingHistory[0].progress.page}</span>
            </button>
          </div>
        )}

        {/* ── DEDICATED CATALOGUE SEARCH & FILTER CONTROLS ─────── */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-4">
          {/* Main Control Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, discipline, department, or year..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 hover:bg-white focus:bg-white rounded-xl border border-black/10 focus:border-[#200441] focus:ring-2 focus:ring-[#200441]/15 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 transition-all outline-none"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <FiSearch className="w-4 h-4" />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
                  title="Clear search"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Desktop Filters: Faculty, Department & Sort */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              {/* Faculty Select */}
              <div className="relative">
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="appearance-none bg-gray-50 hover:bg-white border border-black/10 text-gray-800 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#200441] focus:ring-2 focus:ring-[#200441]/15 transition font-medium cursor-pointer max-w-[210px] truncate"
                >
                  {availableFaculties.map((fac) => (
                    <option key={fac} value={fac}>
                      {fac === 'All Faculties' ? 'All Faculties' : fac}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Department Select (Cascades with faculty) */}
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="appearance-none bg-gray-50 hover:bg-white border border-black/10 text-gray-800 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#200441] focus:ring-2 focus:ring-[#200441]/15 transition font-medium cursor-pointer max-w-[220px] truncate"
                >
                  {availableDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === 'All Departments' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort Select */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as BookSortOption)}
                  className="appearance-none bg-gray-50 hover:bg-white border border-black/10 text-gray-800 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#200441] focus:ring-2 focus:ring-[#200441]/15 transition font-medium cursor-pointer"
                >
                  <option value="default">Sort: Curricular Order</option>
                  <option value="title-asc">Title: A to Z</option>
                  <option value="title-desc">Title: Z to A</option>
                  <option value="year-desc">Year: Newest First</option>
                  <option value="year-asc">Year: Oldest First</option>
                </select>
                <FiChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="flex md:hidden items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeFiltersCount > 0
                    ? 'bg-[#200441] text-white border-[#200441]'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-black/10'
                }`}
              >
                <FiSliders className="w-3.5 h-3.5" />
                <span>Filter & Sort</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FDE88C] text-[#200441] text-[10px] font-mono font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-2.5 rounded-xl border border-black/10 text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Reset filters"
                >
                  <FiRotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Expandable Mobile Filter Tray */}
          <AnimatePresence>
            {isMobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden pt-3 border-t border-gray-100 flex flex-col gap-3 overflow-hidden"
              >
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 uppercase font-mono block mb-1">
                    Select Faculty
                  </label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full bg-gray-50 border border-black/10 text-gray-900 text-xs rounded-xl p-2.5"
                  >
                    {availableFaculties.map((fac) => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 uppercase font-mono block mb-1">
                    Select Academic Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-gray-50 border border-black/10 text-gray-900 text-xs rounded-xl p-2.5"
                  >
                    {availableDepartments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 uppercase font-mono block mb-1">
                    Sort Textbooks By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as BookSortOption)}
                    className="w-full bg-gray-50 border border-black/10 text-gray-900 text-xs rounded-xl p-2.5"
                  >
                    <option value="default">Curricular Order (Default)</option>
                    <option value="title-asc">Title: A to Z</option>
                    <option value="title-desc">Title: Z to A</option>
                    <option value="year-desc">Year: Newest First</option>
                    <option value="year-asc">Year: Oldest First</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-[#200441] text-white text-xs font-semibold cursor-pointer"
                  >
                    Apply Filters
                  </button>
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Core Academic Area Filter Pills */}
          {availableCoreAreas.length > 2 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold shrink-0 mr-1">
                  Disciplines:
                </span>
                {availableCoreAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setSelectedCoreArea(area)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                      selectedCoreArea === area
                        ? 'bg-[#200441] text-white shadow-xs font-semibold'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filter Tags & Results Counter */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 font-medium">
                Showing <strong className="text-gray-900">{filteredBooks.length}</strong> of {allBooks.length} textbooks
              </span>

              {/* Active Removable Tags */}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECE0EF] text-[#200441] font-medium text-[11px]">
                  <span>"{searchQuery}"</span>
                  <button type="button" onClick={() => setSearchQuery('')} className="hover:text-red-600 cursor-pointer">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedFaculty !== 'All Faculties' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200/50 font-medium text-[11px]">
                  <span>{selectedFaculty}</span>
                  <button type="button" onClick={() => setSelectedFaculty('All Faculties')} className="hover:text-red-600 cursor-pointer">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedDept !== 'All Departments' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200/50 font-medium text-[11px]">
                  <span>{selectedDept}</span>
                  <button type="button" onClick={() => setSelectedDept('All Departments')} className="hover:text-red-600 cursor-pointer">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCoreArea !== 'All Areas' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/50 font-medium text-[11px]">
                  <span>{selectedCoreArea}</span>
                  <button type="button" onClick={() => setSelectedCoreArea('All Areas')} className="hover:text-red-600 cursor-pointer">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}

              {sortBy !== 'default' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 font-medium text-[11px]">
                  <span>Sorted</span>
                  <button type="button" onClick={() => setSortBy('default')} className="hover:text-red-600 cursor-pointer">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-[#200441] hover:text-red-600 font-medium transition cursor-pointer underline"
              >
                <FiRotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* ── UNIFIED SINGULAR BOOK FEED ───────────────────────── */}
        <div className="w-full flex flex-col gap-6">
          {filteredBooks.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-black/5 shadow-xs max-w-lg mx-auto my-6">
              <FiBookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="font-heading text-base sm:text-lg font-medium text-gray-900">
                No textbooks match your criteria
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                Try adjusting your search keyword or clearing the faculty and department filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#200441] text-white text-xs font-semibold hover:bg-[#35145D] transition shadow-xs cursor-pointer"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5 sm:gap-5">
                <AnimatePresence mode="popLayout">
                  {visibleBooks.map((book, idx) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      index={idx}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More Button if remaining titles exist */}
              {displayLimit < filteredBooks.length && (
                <div className="flex flex-col items-center justify-center pt-8 pb-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setDisplayLimit((prev) => prev + 24)}
                    className="px-6 py-3 rounded-2xl bg-[#200441] hover:bg-[#320864] text-white font-medium text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2"
                  >
                    <span>Load More Titles</span>
                    <span className="text-white/60 text-xs font-mono">
                      (+{Math.min(24, filteredBooks.length - displayLimit)})
                    </span>
                  </button>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Showing {visibleBooks.length} of {filteredBooks.length} books
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </LibraryDashboardLayout>
  )
}
