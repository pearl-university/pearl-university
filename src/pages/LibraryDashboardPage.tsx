import { type FC, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  FiArrowUpRight,
  FiBookOpen,
  FiBookmark,
  FiDownload,
  FiEye,
  FiClock,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { LibraryDashboardLayout } from '../components/library/dashboard/LibraryDashboardLayout'
import { useUI } from '../context/UIContext'
import { useLibraryFilter } from '../context/LibraryFilterContext'
import { BookCover } from '../components/library/BookCover'
import { LibraryPdfReader } from '../components/library/reader/LibraryPdfReader'
import { getReadingProgress } from '../utils/readingProgress'
import type { BookMetadata } from '../utils/bookScanner'

const DynamicBookCard: FC<{
  book: BookMetadata
  index: number
  onReadBook: (book: BookMetadata) => void
}> = ({ book, index, onReadBook }) => {
  const { alert } = useUI()
  const progress = useMemo(() => getReadingProgress(book.id), [book.id])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="bg-white rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 items-stretch shadow-xs hover:shadow-xl transition-all duration-300 border border-black/5 group cursor-pointer"
      onClick={() => onReadBook(book)}
    >
      {/* Book Cover with Dynamic First-Page Extraction */}
      <div className="w-24 sm:w-28 md:w-32 shrink-0">
        <BookCover
          pdfUrl={book.fileUrl}
          title={book.title}
          author={book.author}
          faculty={book.faculty}
          department={book.department}
          aspectRatio="aspect-[3/4.2]"
        />
      </div>

      {/* Book Meta Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#200441] bg-[#ECE0EF] px-2 py-0.5 rounded-md font-semibold truncate max-w-[170px]">
              {book.coreArea}
            </span>
            {book.publishedYear && (
              <span className="text-[10px] text-gray-400 font-mono">
                {book.publishedYear}
              </span>
            )}
            {progress && (
              <span className="text-[10px] text-purple-700 bg-purple-50 font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                <FiClock className="w-2.5 h-2.5" /> p.{progress.page}/{progress.totalPages}
              </span>
            )}
          </div>

          <h3 className="font-heading font-medium text-sm sm:text-[15px] md:text-base text-gray-900 group-hover:text-[#200441] transition-colors leading-snug line-clamp-2">
            {book.title}
          </h3>

          {/* Single Author Field */}
          <p className="text-xs text-gray-600 font-normal mt-1 line-clamp-1">
            {book.author}
          </p>

          {/* Combined Extra Meta (volume, edition, publication) */}
          <p className="text-[11px] text-gray-400 font-light mt-0.5 line-clamp-1">
            {book.extraMeta}
          </p>
        </div>

        {/* Action Bar */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onReadBook(book)
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#200441] hover:bg-[#35145D] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            <FiEye className="w-3.5 h-3.5" />
            <span>{progress ? 'Resume' : 'Read'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                alert.success('Saved to Bookshelf', `"${book.title}" has been saved.`)
              }}
              className="p-1.5 rounded-full text-gray-400 hover:text-[#200441] hover:bg-[#ECE0EF] transition cursor-pointer"
              title="Bookmark this book"
            >
              <FiBookmark className="w-3.5 h-3.5" />
            </button>
            <a
              href={book.fileUrl}
              download={book.fileName}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-full text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer inline-flex"
              title="Download PDF for offline study"
            >
              <FiDownload className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const RecentlyAddedItem: FC<{
  book: BookMetadata
  index: number
  onReadBook: (book: BookMetadata) => void
}> = ({ book, index, onReadBook }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
      onClick={() => onReadBook(book)}
      title="Open in In-App Reader"
    >
      {/* Dynamic Miniature Cover */}
      <div className="w-12 sm:w-14 shrink-0">
        <BookCover
          pdfUrl={book.fileUrl}
          title={book.title}
          author={book.author}
          faculty={book.faculty}
          department={book.department}
          aspectRatio="aspect-[3/4]"
        />
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0">
        <h4 className="font-heading font-medium text-xs sm:text-[13px] text-gray-900 group-hover:text-[#200441] transition-colors leading-snug line-clamp-2">
          {book.title}
        </h4>
        <p className="text-[11px] text-gray-600 mt-0.5 truncate">{book.author}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="inline-block text-[10px] text-gray-400 font-mono truncate">
            {book.coreArea}
          </span>
          <span className="text-[9px] text-purple-600 font-mono font-semibold uppercase">
            {book.fileExtension}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export const LibraryDashboardPage: FC = () => {
  const {
    filteredBooks,
    allBooks,
    selectedFaculty,
    selectedDept,
    selectedCoreArea,
    setSelectedCoreArea,
    availableCoreAreas,
    searchQuery,
  } = useLibraryFilter()

  const [activeReadingBook, setActiveReadingBook] = useState<BookMetadata | null>(null)

  // Memoize continue reading shelf items
  const continueReadingBooks = useMemo(() => {
    return allBooks
      .map((b) => ({ book: b, progress: getReadingProgress(b.id) }))
      .filter((item): item is { book: BookMetadata; progress: NonNullable<ReturnType<typeof getReadingProgress>> } => 
        Boolean(item.progress && item.progress.page > 0)
      )
      .sort((a, b) => b.progress.lastReadAt - a.progress.lastReadAt)
  }, [allBooks])

  const suggestedReads = filteredBooks.slice(0, 4)
  const topReads = filteredBooks.length > 4 ? filteredBooks.slice(4) : filteredBooks

  return (
    <LibraryDashboardLayout>
      <Helmet>
        <title>e-Library Catalogue | Pearl University</title>
        <meta
          name="description"
          content="Access university textbooks, suggested reads, and digital archives with in-app reader at Pearl University."
        />
      </Helmet>

      {/* ── IN-APP PDF READER MODAL OVERLAY ─────────────────── */}
      <AnimatePresence>
        {activeReadingBook && (
          <LibraryPdfReader
            book={activeReadingBook}
            onClose={() => setActiveReadingBook(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto flex flex-col gap-6 pb-10">
        {/* Continue Reading Shelf (If student has reading history) */}
        {continueReadingBooks.length > 0 && !searchQuery && (
          <div className="bg-gradient-to-r from-[#1B0A37] to-[#2E0B59] rounded-2xl p-4 sm:p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-16 shrink-0 hidden sm:block">
                <BookCover
                  pdfUrl={continueReadingBooks[0].book.fileUrl}
                  title={continueReadingBooks[0].book.title}
                  author={continueReadingBooks[0].book.author}
                  aspectRatio="aspect-[3/4]"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-[#FDE88C] font-semibold mb-1">
                  <HiSparkles className="w-3.5 h-3.5" />
                  <span>CONTINUE READING</span>
                </div>
                <h3 className="font-heading font-medium text-base sm:text-lg text-white truncate">
                  {continueReadingBooks[0].book.title}
                </h3>
                <p className="text-xs text-white/70 truncate">
                  {continueReadingBooks[0].book.author} • Page {continueReadingBooks[0].progress.page} of {continueReadingBooks[0].progress.totalPages}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveReadingBook(continueReadingBooks[0].book)}
              className="px-5 py-2.5 rounded-xl bg-[#FDE88C] hover:bg-[#fde16e] text-[#1B0A37] font-semibold text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiEye className="w-4 h-4" />
              <span>Resume Page {continueReadingBooks[0].progress.page}</span>
            </button>
          </div>
        )}

        {/* Dynamic Core Academic Area Filter Pills */}
        {availableCoreAreas.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-xs font-mono uppercase text-gray-500 font-medium shrink-0 mr-1">
              Core Areas:
            </span>
            {availableCoreAreas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedCoreArea(area)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCoreArea === area
                    ? 'bg-[#200441] text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-gray-700 border border-black/10'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left / Center Main Content: Suggested Read + Top Reads (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8 sm:gap-10">
            {/* Section 1: Suggested Read */}
            <section>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-baseline gap-2.5">
                  <h2 className="font-heading text-xl sm:text-2xl font-medium text-gray-950 tracking-tight">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : selectedFaculty !== 'All Faculties'
                      ? `${selectedFaculty} — Suggested Reads`
                      : 'Suggested Read'}
                  </h2>
                  <span className="text-xs font-mono text-gray-400 font-medium">
                    ({filteredBooks.length} available)
                  </span>
                </div>

                <Link
                  to="/library/dashboard/catalogue"
                  className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#200441] transition inline-flex items-center gap-1 group"
                >
                  <span>View all</span>
                  <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {filteredBooks.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-black/5 shadow-xs">
                  <FiBookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-heading text-base font-medium text-gray-800">
                    No books found matching criteria
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Try clearing your search keyword or switching faculty and department filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <AnimatePresence mode="popLayout">
                    {suggestedReads.map((book, idx) => (
                      <DynamicBookCard
                        key={book.id}
                        book={book}
                        index={idx}
                        onReadBook={(b) => setActiveReadingBook(b)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

            {/* Section 2: Top Reads / Core Departmental Textbooks */}
            {filteredBooks.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="font-heading text-xl sm:text-2xl font-medium text-gray-950 tracking-tight">
                    {selectedDept !== 'All Departments'
                      ? `${selectedDept} — Top Reads`
                      : 'Top Reads'}
                  </h2>
                  <Link
                    to="/library/dashboard/catalogue"
                    className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#200441] transition inline-flex items-center gap-1 group"
                  >
                    <span>View all</span>
                    <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <AnimatePresence mode="popLayout">
                    {topReads.map((book, idx) => (
                      <DynamicBookCard
                        key={book.id}
                        book={book}
                        index={idx + 4}
                        onReadBook={(b) => setActiveReadingBook(b)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Recently Added (4 cols) - Sticky Top */}
          <div className="lg:col-span-4 flex flex-col h-fit">
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-black/5 sticky top-0 sm:top-2">
              <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-gray-100">
                <h3 className="font-heading text-base sm:text-lg font-medium text-gray-950 flex items-center gap-2">
                  <FiBookOpen className="w-4 h-4 text-[#200441]" />
                  <span>Recently Added</span>
                </h3>
                <span className="text-[11px] font-mono text-gray-400">
                  {allBooks.length} titles
                </span>
              </div>

              <div className="flex flex-col gap-2 divide-y divide-gray-50">
                {allBooks.map((book, idx) => (
                  <RecentlyAddedItem
                    key={book.id}
                    book={book}
                    index={idx}
                    onReadBook={(b) => setActiveReadingBook(b)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LibraryDashboardLayout>
  )
}
