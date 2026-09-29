import { type FC, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBookmark,
  FiDownload,
  FiEye,
  FiClock,
} from 'react-icons/fi'
import { BookCover } from './BookCover'
import { useLibraryContext } from '../../context/LibraryContext'
import type { BookMetadata } from '../../utils/bookScanner'

export interface BookCardProps {
  book: BookMetadata
  index?: number
  variant?: 'standard' | 'compact'
  showProgress?: boolean
  className?: string
  onCardClick?: (book: BookMetadata) => void
  onRead?: (book: BookMetadata) => void
}

export const BookCard: FC<BookCardProps> = ({
  book,
  index = 0,
  variant = 'standard',
  showProgress = false,
  className = '',
  onCardClick,
  onRead,
}) => {
  const navigate = useNavigate()
  const { openReader, isBookmarked: checkIsBookmarked, toggleBookmark, getReadingProgress } = useLibraryContext()

  const isSaved = checkIsBookmarked(book.id)
  const progress = useMemo(() => getReadingProgress(book.id), [getReadingProgress, book.id])

  const percent = progress && progress.totalPages > 0
    ? Math.min(100, Math.round((progress.page / progress.totalPages) * 100))
    : 0

  const handleCardClick = () => {
    onCardClick?.(book)
    navigate(`/library/dashboard/book/${book.id}`)
  }

  const handleReadClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRead?.(book)
    openReader(book)
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBookmark(book)
  }

  // ── VARIANT 1: COMPACT (VERTICAL) ───────────────────────────
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.15) }}
        className={`bg-white rounded-2xl p-4 border border-black/5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer overflow-hidden ${className}`}
        onClick={handleCardClick}
      >
        <div>
          <div className="w-full mb-3">
            <BookCover
              pdfUrl={book.fileUrl}
              title={book.title}
              author={book.author}
              faculty={book.faculty}
              department={book.department}
              aspectRatio="aspect-[3/4]"
            />
          </div>

          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[9px] uppercase font-mono tracking-wider text-[#200441] bg-[#ECE0EF] px-2 py-0.5 rounded-md font-semibold truncate block max-w-[150px]">
              {book.coreArea}
            </span>
            {book.publishedYear && (
              <span className="text-[10px] text-gray-400 font-mono">
                {book.publishedYear}
              </span>
            )}
          </div>

          <h4 className="font-heading font-medium text-xs sm:text-sm text-gray-900 group-hover:text-[#200441] transition-colors line-clamp-2 leading-snug">
            {book.title}
          </h4>

          <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
            {book.author}
          </p>

          {showProgress && progress && (
            <div className="mt-2.5 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-600 mb-1">
                <span className="font-semibold text-purple-800">
                  p.{progress.page}/{progress.totalPages}
                </span>
                <span>{percent}%</span>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-700 to-indigo-600 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReadClick}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#200441] hover:bg-[#35145D] text-white text-[11px] font-medium transition cursor-pointer"
          >
            <FiEye className="w-3 h-3" />
            <span>{progress ? 'Resume' : 'Read'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                isSaved
                  ? 'text-[#200441] bg-[#ECE0EF] hover:bg-[#dfd0e3]'
                  : 'text-gray-400 hover:text-[#200441] hover:bg-gray-100'
              }`}
              title={isSaved ? 'Remove from bookshelf' : 'Save to bookshelf'}
            >
              <FiBookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <a
              href={book.fileUrl}
              download={book.fileName}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-full text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer inline-flex"
              title="Download PDF"
            >
              <FiDownload className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── VARIANT 2: STANDARD (HORIZONTAL) ────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.015, 0.12) }}
      className={`bg-white rounded-2xl p-3.5 sm:p-4.5 flex gap-3.5 sm:gap-4.5 items-stretch shadow-xs hover:shadow-xl transition-all duration-300 border border-black/5 group cursor-pointer overflow-hidden ${className}`}
      onClick={handleCardClick}
    >
      {/* Book Cover with Dynamic First-Page Extraction */}
      <div className="w-22 sm:w-26 md:w-28 shrink-0">
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
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 overflow-hidden">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#200441] bg-[#ECE0EF] px-2 py-0.5 rounded-md font-semibold truncate max-w-[150px]">
              {book.coreArea}
            </span>
            {book.publishedYear && (
              <span className="text-[10px] text-gray-400 font-mono">
                {book.publishedYear}
              </span>
            )}
            {progress && (
              <span className="text-[10px] text-purple-700 bg-purple-50 font-mono px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 font-medium">
                <FiClock className="w-2.5 h-2.5" /> p.{progress.page}/{progress.totalPages}
              </span>
            )}
          </div>

          <h3 className="font-heading font-medium text-sm sm:text-[15px] text-gray-900 group-hover:text-[#200441] transition-colors leading-snug line-clamp-2">
            {book.title}
          </h3>

          <p className="text-xs text-gray-600 font-normal mt-1 line-clamp-1">
            {book.author}
          </p>

          <p className="text-[11px] text-gray-400 font-light mt-0.5 line-clamp-1">
            {book.department}
          </p>

          {/* Reading Progress Bar (if requested) */}
          {showProgress && progress && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-600 mb-1">
                <span className="font-semibold text-purple-800">
                  p.{progress.page} of {progress.totalPages}
                </span>
                <span>{percent}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-700 to-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Harmonized Action Bar */}
        <div className="mt-3 flex items-center justify-between gap-1.5 border-t border-gray-100 pt-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReadClick}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#200441] hover:bg-[#35145D] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            <FiEye className="w-3.5 h-3.5" />
            <span>{progress ? 'Resume' : 'Read'}</span>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-full transition cursor-pointer shrink-0 ${
                isSaved
                  ? 'text-[#200441] bg-[#ECE0EF] hover:bg-[#dfd0e3]'
                  : 'text-gray-400 hover:text-[#200441] hover:bg-[#ECE0EF]'
              }`}
              title={isSaved ? 'Remove from bookshelf' : 'Save to bookshelf'}
            >
              <FiBookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <a
              href={book.fileUrl}
              download={book.fileName}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-full text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer inline-flex shrink-0"
              title="Download PDF"
            >
              <FiDownload className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
