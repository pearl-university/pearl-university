import { type FC, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  FiBookmark,
  FiClock,
  FiTrash2,
  FiArrowRight,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { LibraryDashboardLayout } from '../components/library/dashboard/LibraryDashboardLayout'
import { useUI } from '../context/UIContext'
import { useLibraryContext } from '../context/LibraryContext'
import { BookCard } from '../components/library/BookCard'

export const LibrarySavedPage: FC = () => {
  const { confirm } = useUI()
  const {
    savedBooks,
    savedCount,
    clearBookmarks,
    readingHistory,
    clearReadingHistory,
  } = useLibraryContext()

  const location = useLocation()
  const navigate = useNavigate()

  // Default to 'saved' when visiting /library/dashboard/saved
  const [activeTab, setActiveTab] = useState<'reads' | 'saved'>(() => {
    if (location.pathname.endsWith('/reads')) return 'reads'
    return 'saved'
  })

  // Sync tab with URL
  useEffect(() => {
    if (location.pathname.endsWith('/reads')) {
      setActiveTab('reads')
    } else if (location.pathname.endsWith('/saved')) {
      setActiveTab('saved')
    }
  }, [location.pathname])

  const handleClearHistory = async () => {
    const ok = await confirm({
      title: 'Clear Reading History?',
      message: 'This will reset your saved progress across all active books.',
      confirmText: 'Clear History',
      variant: 'danger',
    })
    if (ok) {
      clearReadingHistory()
    }
  }

  const handleClearBookmarks = async () => {
    const ok = await confirm({
      title: 'Clear All Bookmarks?',
      message: 'This will remove all saved books from your personal bookshelf.',
      confirmText: 'Clear Bookmarks',
      variant: 'danger',
    })
    if (ok) {
      clearBookmarks()
    }
  }

  const handleTabChange = (tab: 'reads' | 'saved') => {
    setActiveTab(tab)
    navigate(tab === 'saved' ? '/library/dashboard/saved' : '/library/dashboard/reads', {
      replace: true,
    })
  }

  return (
    <LibraryDashboardLayout>
      <Helmet>
        <title>My Academic Bookshelf | Pearl University e-Library</title>
        <meta
          name="description"
          content="Access your active reading progress, saved bookmarked textbooks, and digital reading history."
        />
      </Helmet>

      <div className="max-w-[1600px] mx-auto flex flex-col gap-8 pb-16">
        {/* ── HERO BANNER ──────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B0A37] via-[#2A0854] to-[#3B1566] text-white p-6 sm:p-8 md:p-10 shadow-xl border border-white/10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FDE88C] text-xs font-semibold mb-3 border border-white/10">
              <HiSparkles className="w-3.5 h-3.5" />
              <span>PERSONAL ACADEMIC BOOKSHELF</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
              My Bookshelf & Reading Progress
            </h1>
            <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
              Resume where you stopped reading, track your textbook study milestones, and manage your bookmarked curriculum materials.
            </p>
          </div>
        </div>

        {/* ── TAB SELECTOR & ACTIONS ──────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-black/5 shadow-xs">
            <button
              type="button"
              onClick={() => handleTabChange('saved')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-[#200441] text-white shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FiBookmark className="w-4 h-4" />
              <span>Saved Bookmarks ({savedCount})</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('reads')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'reads'
                  ? 'bg-[#200441] text-white shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FiClock className="w-4 h-4" />
              <span>Continue Reading ({readingHistory.length})</span>
            </button>
          </div>

          {activeTab === 'reads' && readingHistory.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-xl hover:bg-red-50 transition cursor-pointer self-start sm:self-auto"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          {activeTab === 'saved' && savedCount > 0 && (
            <button
              type="button"
              onClick={handleClearBookmarks}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-xl hover:bg-red-50 transition cursor-pointer self-start sm:self-auto"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Clear Bookmarks</span>
            </button>
          )}
        </div>

        {/* ── TAB CONTENT: SAVED BOOKMARKS ────────────────────── */}
        {activeTab === 'saved' && (
          <div>
            {savedBooks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-black/5 shadow-xs max-w-lg mx-auto my-6">
                <FiBookmark className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-medium text-gray-900">
                  Your bookshelf is currently empty
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                  Click the bookmark icon on any textbook in the library catalogue to save it to your personal shelf.
                </p>
                <Link
                  to="/library/dashboard"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#200441] text-white text-xs font-semibold hover:bg-[#35145D] transition shadow-xs"
                >
                  <span>Explore Textbooks</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5 sm:gap-5">
                {savedBooks.map((book, idx) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    index={idx}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB CONTENT: ACTIVE READS ───────────────────────── */}
        {activeTab === 'reads' && (
          <div>
            {readingHistory.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-black/5 shadow-xs max-w-lg mx-auto my-6">
                <FiClock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-medium text-gray-900">
                  No reading progress recorded yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                  Start reading any textbook in the library and your page positions will be automatically saved here.
                </p>
                <Link
                  to="/library/dashboard"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#200441] text-white text-xs font-semibold hover:bg-[#35145D] transition shadow-xs"
                >
                  <span>Browse Library Catalogue</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5 sm:gap-5">
                {readingHistory.map((item, idx) => (
                  <BookCard
                    key={item.book.id}
                    book={item.book}
                    index={idx}
                    showProgress={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </LibraryDashboardLayout>
  )
}
