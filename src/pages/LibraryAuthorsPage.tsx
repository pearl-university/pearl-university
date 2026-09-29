import { type FC, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  FiUsers,
  FiSearch,
  FiBook,
  FiChevronRight,
  FiX,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { LibraryDashboardLayout } from '../components/library/dashboard/LibraryDashboardLayout'
import { getAuthorsDirectory, type AuthorDirectoryEntry } from '../utils/bookScanner'
import { BookCard } from '../components/library/BookCard'

const ALPHABET = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]

export const LibraryAuthorsPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('ALL')
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorDirectoryEntry | null>(null)

  const allAuthors = useMemo(() => getAuthorsDirectory(), [])

  // Filtered authors based on search and alphabet letter
  const filteredAuthors = useMemo(() => {
    return allAuthors.filter((entry) => {
      const name = entry.author.toLowerCase()
      const query = searchQuery.toLowerCase().trim()

      if (query && !name.includes(query) && !entry.departments.some(d => d.toLowerCase().includes(query))) {
        return false
      }

      if (selectedLetter !== 'ALL') {
        const cleanName = entry.author.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim()
        if (!cleanName.toUpperCase().startsWith(selectedLetter)) {
          return false
        }
      }

      return true
    })
  }, [allAuthors, searchQuery, selectedLetter])

  return (
    <LibraryDashboardLayout>
      <Helmet>
        <title>Authors & Scholars Directory | Pearl University e-Library</title>
        <meta
          name="description"
          content="Browse academic authors, distinguished professors, and global textbook publications at Pearl University e-Library."
        />
      </Helmet>



      {/* Author Publications Slide-Over / Modal */}
      <AnimatePresence>
        {selectedAuthor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-black/10"
            >
              {/* Modal Header */}
              <div className="p-6 bg-[#1B0A37] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FDE88C] text-[#1B0A37] font-heading font-bold text-lg flex items-center justify-center shrink-0">
                    {selectedAuthor.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-medium text-white">
                      {selectedAuthor.author}
                    </h3>
                    <p className="text-xs text-[#FDE88C] font-mono mt-0.5">
                      {selectedAuthor.booksCount} Textbooks Published
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAuthor(null)}
                  className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Book List */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                <p className="text-xs font-mono uppercase text-gray-500 font-semibold tracking-wider">
                  Indexed Curriculum Publications:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedAuthor.books.map((book, idx) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      index={idx}
                      onRead={() => setSelectedAuthor(null)}
                      onCardClick={() => setSelectedAuthor(null)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto flex flex-col gap-8 pb-16">
        {/* ── HERO BANNER ──────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B0A37] via-[#24064B] to-[#381561] text-white p-6 sm:p-8 md:p-10 shadow-xl border border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FDE88C] text-xs font-semibold mb-3 border border-white/10">
              <HiSparkles className="w-3.5 h-3.5" />
              <span>ACADEMIC DIRECTORY</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
              Authors & Scholars Directory
            </h1>
            <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
              Explore the educators, distinguished researchers, and academic councils behind Pearl University's comprehensive curriculum collection.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search author name, research topic, or department..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#FDE88C]/50 transition"
              />
            </div>
            <span className="text-xs font-mono text-white/60">
              Showing {filteredAuthors.length} of {allAuthors.length} authors
            </span>
          </div>
        </div>

        {/* ── ALPHABET A-Z QUICK JUMP BAR ─────────────────────── */}
        <div className="bg-white rounded-2xl p-2.5 border border-black/5 shadow-xs flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium shrink-0 transition-all cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-[#200441] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* ── AUTHORS CARDS GRID ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAuthors.map((authorEntry, idx) => (
            <motion.div
              key={authorEntry.author}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.2) }}
              className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Author Avatar & Book Count */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1B0A37] to-[#381561] text-[#FDE88C] font-heading font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                    {authorEntry.author.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#200441] bg-[#ECE0EF] px-2.5 py-1 rounded-full flex items-center gap-1">
                    <FiBook className="w-3 h-3" />
                    {authorEntry.booksCount} {authorEntry.booksCount === 1 ? 'Book' : 'Books'}
                  </span>
                </div>

                {/* Author Name */}
                <h3 className="font-heading font-medium text-base text-gray-900 group-hover:text-[#200441] transition-colors leading-snug line-clamp-2">
                  {authorEntry.author}
                </h3>

                {/* Primary Department Tags */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {authorEntry.departments.slice(0, 2).map((dept) => (
                    <span
                      key={dept}
                      className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[200px]"
                    >
                      {dept}
                    </span>
                  ))}
                  {authorEntry.departments.length > 2 && (
                    <span className="text-[10px] text-purple-700 bg-purple-50 font-mono px-1.5 py-0.5 rounded-md">
                      +{authorEntry.departments.length - 2}
                    </span>
                  )}
                </div>

                {/* Sample Book Title Preview */}
                <p className="mt-3 text-xs text-gray-500 line-clamp-1 italic border-t border-gray-100 pt-2">
                  "{authorEntry.books[0]?.title}"
                </p>
              </div>

              {/* View Publications CTA */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedAuthor(authorEntry)}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF7FB] hover:bg-[#200441] text-[#200441] hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>View All {authorEntry.booksCount} Books</span>
                  <FiChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAuthors.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-black/5 shadow-xs max-w-lg mx-auto my-6">
            <FiUsers className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-medium text-gray-900">
              No authors match your search
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Try searching with another name or selecting 'ALL' in the alphabet bar.
            </p>
          </div>
        )}
      </div>
    </LibraryDashboardLayout>
  )
}
