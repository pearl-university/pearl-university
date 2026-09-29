import type { FC } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiMenu,
  FiBell,
  FiBookmark,
} from 'react-icons/fi'
import { HiSparkles, HiAcademicCap } from 'react-icons/hi2'
import { useLibraryContext } from '../../../context/LibraryContext'

interface LibraryTopBarProps {
  onToggleMobileMenu: () => void
}

export const LibraryTopBar: FC<LibraryTopBarProps> = ({
  onToggleMobileMenu,
}) => {
  const location = useLocation()
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true)
  const { savedCount } = useLibraryContext()

  // Page title contextual helper
  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('/faculties')) return 'Faculties & Academic Sections'
    if (path.includes('/authors')) return 'Authors & Scholars Directory'
    if (path.includes('/spotlight')) return 'Curricula Spotlight'
    if (path.includes('/saved')) return 'My Bookshelf'
    if (path.includes('/reads')) return 'Reading Progress'
    if (path.includes('/book/')) return 'Textbook Details'
    return 'Digital Textbook Catalogue'
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[#ECE0EF]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 border-b border-black/5 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Section: Mobile Menu Trigger + Contextual Page Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open sidebar navigation"
            className="lg:hidden p-2 rounded-xl bg-white/70 hover:bg-white text-[#200441] border border-black/5 transition shadow-xs cursor-pointer shrink-0"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-heading text-sm sm:text-base font-semibold text-[#200441] truncate tracking-tight">
              {getPageTitle()}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 text-[10px] font-mono text-purple-900 border border-purple-200/60 shrink-0 font-medium">
              <HiSparkles className="w-3 h-3 text-[#200441]" />
              <span>611 TEXTBOOKS</span>
            </span>
          </div>
        </div>

        {/* Right Section: Repository Badge + Bookshelf Link + Notifications */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Bookshelf Shortcut */}
          <Link
            to="/library/dashboard/saved"
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition shadow-xs cursor-pointer ${
              location.pathname.includes('/saved')
                ? 'bg-[#200441] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-gray-700 hover:text-[#200441] border border-black/10'
            }`}
            title="View saved academic bookshelf"
          >
            <FiBookmark className={`w-3.5 h-3.5 ${location.pathname.includes('/saved') ? 'fill-current text-[#FDE88C]' : ''}`} />
            <span className="hidden sm:inline">My Bookshelf</span>
            {savedCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                location.pathname.includes('/saved')
                  ? 'bg-[#FDE88C] text-[#200441]'
                  : 'bg-[#200441] text-[#FDE88C]'
              }`}>
                {savedCount}
              </span>
            )}
          </Link>

          {/* Open Access Academic Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-full border border-black/10 shadow-xs">
            <div className="w-6 h-6 rounded-full bg-[#200441] text-[#FDE88C] flex items-center justify-center shrink-0 shadow-2xs">
              <HiAcademicCap className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-gray-800 leading-tight">
              Open Access
            </span>
          </div>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => setHasUnreadNotifications(false)}
            aria-label="Library Notifications"
            className="relative p-2 rounded-full text-gray-700 hover:text-black hover:bg-black/5 transition cursor-pointer"
          >
            <FiBell className="w-4.5 h-4.5" />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}


