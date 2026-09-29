import { type FC, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  FiArrowLeft,
  FiEye,
  FiBookmark,
  FiDownload,
  FiShare2,
  FiClock,
  FiBookOpen,
  FiLayers,
  FiCalendar,
  FiFileText,
} from 'react-icons/fi'
import { HiSparkles, HiAcademicCap } from 'react-icons/hi2'
import { LibraryDashboardLayout } from '../components/library/dashboard/LibraryDashboardLayout'
import { useUI } from '../context/UIContext'
import { useLibraryContext } from '../context/LibraryContext'
import { getBookById, getRelatedBooks } from '../utils/bookScanner'
import { BookCover } from '../components/library/BookCover'
import { BookCard } from '../components/library/BookCard'

export const LibraryBookDetailsPage: FC = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const { alert } = useUI()
  const { openReader, isBookmarked: checkIsBookmarked, toggleBookmark, getReadingProgress } = useLibraryContext()

  const book = useMemo(() => {
    return bookId ? getBookById(bookId) : null
  }, [bookId])

  const relatedBooks = useMemo(() => {
    return book ? getRelatedBooks(book, 4) : []
  }, [book])

  const progress = book ? getReadingProgress(book.id) : null
  const bookmarked = book ? checkIsBookmarked(book.id) : false

  const handleToggleBookmark = () => {
    if (!book) return
    toggleBookmark(book)
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      alert.success('Link Copied', 'Textbook link copied to your clipboard.')
    }
  }

  if (!book) {
    return (
      <LibraryDashboardLayout>
        <div className="max-w-md mx-auto my-16 bg-white rounded-3xl p-10 text-center border border-black/5 shadow-xs">
          <FiBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="font-heading text-xl font-medium text-gray-900">
            Textbook Not Found
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            The requested textbook entry could not be located in the university repository.
          </p>
          <button
            type="button"
            onClick={() => navigate('/library/dashboard')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#200441] text-white text-xs font-semibold hover:bg-[#381561] transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to Catalogue</span>
          </button>
        </div>
      </LibraryDashboardLayout>
    )
  }

  return (
    <LibraryDashboardLayout>
      <Helmet>
        <title>{`${book.title} | Pearl University e-Library`}</title>
        <meta
          name="description"
          content={`Read ${book.title} by ${book.author}. Official academic textbook prescribed for ${book.department} at Pearl University.`}
        />
      </Helmet>



      <div className="max-w-[1500px] mx-auto flex flex-col gap-8 pb-16">
        {/* ── BREADCRUMB & BACK ACTION ────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium border border-black/5 shadow-2xs transition cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                bookmarked
                  ? 'bg-[#200441] text-white border-[#200441] shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-black/10'
              }`}
            >
              <FiBookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{bookmarked ? 'Saved to Bookshelf' : 'Save Book'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-black/10 transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="Share textbook link"
            >
              <FiShare2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* ── MAIN BOOK SPOTLIGHT HERO ────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-black/5 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Book Cover + Progress + Download */}
          <div className="lg:col-span-4 flex flex-col items-center gap-6">
            <div className="w-48 sm:w-56 md:w-64 max-w-full shadow-2xl rounded-2xl overflow-hidden border border-black/10 hover:scale-102 transition-transform duration-300">
              <BookCover
                pdfUrl={book.fileUrl}
                title={book.title}
                author={book.author}
                faculty={book.faculty}
                department={book.department}
                aspectRatio="aspect-[3/4.2]"
              />
            </div>

            {/* Reading Progress Capsule (If started) */}
            {progress && (
              <div className="w-full bg-[#FAF7FB] rounded-2xl p-4 border border-black/5">
                <div className="flex items-center justify-between text-xs font-mono text-gray-700 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-purple-900">
                    <FiClock className="w-3.5 h-3.5 text-purple-600" />
                    Page {progress.page} of {progress.totalPages}
                  </span>
                  <span>{Math.min(100, Math.round((progress.page / (progress.totalPages || 1)) * 100))}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200/80 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-purple-700 to-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((progress.page / (progress.totalPages || 1)) * 100))}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => openReader(book)}
                  className="w-full py-2 rounded-xl bg-[#200441] text-white text-xs font-semibold hover:bg-[#35145D] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiEye className="w-3.5 h-3.5" />
                  <span>Resume Reading (Page {progress.page})</span>
                </button>
              </div>
            )}

            {/* Direct Action Buttons */}
            <div className="w-full flex flex-col gap-2.5">
              {!progress && (
                <button
                  type="button"
                  onClick={() => openReader(book)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#200441] hover:bg-[#35145D] text-white text-sm font-semibold shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiEye className="w-4 h-4" />
                  <span>Read Online in Viewer</span>
                </button>
              )}

              <a
                href={book.fileUrl}
                download={book.fileName}
                className="w-full py-3 px-6 rounded-2xl bg-[#ECE0EF] hover:bg-[#dfd0e3] text-[#200441] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download Offline PDF Copy</span>
              </a>
            </div>
          </div>

          {/* Right Column: Detailed Bibliographic & Academic Information */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              {/* Category Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10.5px] uppercase font-mono tracking-wider font-semibold text-[#200441] bg-[#ECE0EF] px-3 py-1 rounded-lg">
                  {book.coreArea}
                </span>
                <span className="text-[10.5px] uppercase font-mono tracking-wider text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                  {book.department}
                </span>
                <span className="text-[10.5px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-mono font-medium flex items-center gap-1">
                  <HiSparkles className="w-3 h-3" />
                  Open Repository Access
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium text-gray-950 tracking-tight leading-snug">
                {book.title}
              </h1>

              {/* Author Credits */}
              <div className="mt-3 flex items-center gap-2 text-sm sm:text-base text-gray-700">
                <span className="text-gray-400 font-light">By</span>
                <span className="font-medium text-[#200441]">
                  {book.author}
                </span>
              </div>

              {/* Bibliographic Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7FB] p-4 rounded-2xl border border-black/5">
                <div>
                  <span className="block text-[10px] uppercase font-mono text-gray-400 font-medium">
                    Published Year
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 font-mono mt-0.5 block flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5 text-purple-600" />
                    {book.publishedYear || 'Recent Edition'}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-mono text-gray-400 font-medium">
                    Format
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 font-mono mt-0.5 block flex items-center gap-1">
                    <FiFileText className="w-3.5 h-3.5 text-purple-600" />
                    Digital PDF
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-mono text-gray-400 font-medium">
                    Curriculum Level
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 font-mono mt-0.5 block flex items-center gap-1">
                    <FiLayers className="w-3.5 h-3.5 text-purple-600" />
                    Undergraduate
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-mono text-gray-400 font-medium">
                    Faculty
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 font-mono mt-0.5 block truncate">
                    {book.faculty.replace('Faculty of ', '')}
                  </span>
                </div>
              </div>

              {/* Synopsis / Academic Overview */}
              <div className="mt-6">
                <h3 className="text-xs font-mono uppercase text-gray-400 font-semibold tracking-wider mb-2">
                  Academic Synopsis & Description:
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-white border border-gray-100 p-4 rounded-2xl">
                  {book.description || `Authoritative university textbook and core academic reference covering foundational and advanced concepts in ${book.coreArea} within the Department of ${book.department} at Pearl University.`}
                </p>
              </div>

              {/* Curriculum Prescribed Banner */}
              <div className="mt-6 flex items-center gap-3 p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-[#200441] text-[#FDE88C] flex items-center justify-center shrink-0">
                  <HiAcademicCap className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-gray-900 block">
                    Prescribed Course Curriculum Text
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    Department of {book.department} • {book.faculty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED TEXTBOOKS SECTION ───────────────────────── */}
        {relatedBooks.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg sm:text-xl font-medium text-gray-950">
                  Related Textbooks in {book.coreArea}
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  Complementary curriculum reading from {book.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {relatedBooks.map((relBook, idx) => (
                <BookCard
                  key={relBook.id}
                  book={relBook}
                  variant="compact"
                  index={idx}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </LibraryDashboardLayout>
  )
}
