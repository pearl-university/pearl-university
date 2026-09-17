import type { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome,
  FiBook,
  FiClock,
  FiBookmark,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import logoSvg from '../../../assets/logo.svg'
import { useAuth } from '../../../context/AuthContext'

interface NavItemConfig {
  name: string
  href: string
  icon: typeof FiHome
  badge?: string
}

const PRIMARY_NAV: NavItemConfig[] = [
  { name: 'Home', href: '/library/dashboard', icon: FiHome },
  { name: 'Library', href: '/library/dashboard/catalogue', icon: FiBook },
  { name: 'Reads', href: '/library/dashboard/reads', icon: FiClock },
  { name: 'Saved', href: '/library/dashboard/saved', icon: FiBookmark },
]

export interface LibrarySidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onItemClick?: () => void
}

export const LibrarySidebar: FC<LibrarySidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  onItemClick,
}) => {
  const location = useLocation()
  const { logout } = useAuth()

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      onItemClick?.()
    }
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen max-h-screen sticky top-0 shrink-0 bg-[#1B0A37] text-white flex flex-col justify-between overflow-visible border-r border-white/10 select-none z-40 relative"
      aria-label="Library Navigation Sidebar"
    >
      {/* 1. Dedicated Floating Collapse Toggle at the border between sidebar & top bar */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute -right-3.5 top-6 z-50 w-7 h-7 rounded-full bg-[#1B0A37] border border-white/20 text-white hover:text-[#FDE88C] shadow-xl items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all"
          title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
        >
          {isCollapsed ? (
            <FiChevronRight className="w-3.5 h-3.5" />
          ) : (
            <FiChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {/* Top Section with Logo */}
      <div className="flex flex-col overflow-visible">
        <div
          className={`p-4 sm:p-5 border-b border-white/5 flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <Link
            to="/library/dashboard"
            onClick={onItemClick}
            className={`flex items-center gap-3 group focus:outline-none overflow-hidden ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Pearl University e-Library"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <img
                src={logoSvg}
                alt="Pearl University Emblem"
                className="w-full h-full object-contain"
              />
            </div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col overflow-hidden whitespace-nowrap"
                >
                  <span className="font-heading text-xs font-semibold tracking-wide text-white leading-tight">
                    PEARL UNIVERSITY
                  </span>
                  <span className="text-[9px] text-white/50 tracking-wider font-light uppercase mt-0.5">
                    Building value
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Primary Navigation Links with Floating Hover Tooltips */}
        <nav className="py-6 flex flex-col gap-1.5 px-3 overflow-visible">
          {PRIMARY_NAV.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href === '/library/dashboard' &&
                (location.pathname === '/library/dashboard/' ||
                  location.pathname === '/library-dashboard'))

            const Icon = item.icon

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onItemClick}
                title={isCollapsed ? item.name : undefined}
                className={`relative flex items-center px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isCollapsed ? 'justify-center' : 'gap-4'
                } ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active left indicator bar */}
                {isActive && (
                  <span className="absolute top-1/2 -translate-y-1/2 -left-3 w-1.5 h-6 bg-white rounded-r-full shadow-xs shadow-white/50" />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white stroke-[2.2]' : 'text-white/60 stroke-[1.8]'
                  }`}
                />

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="tracking-wide overflow-hidden whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!isCollapsed && item.badge && (
                  <span className="ml-auto text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
                    {item.badge}
                  </span>
                )}

                {/* Desktop Collapsed Hover Tooltip */}
                {isCollapsed && (
                  <div
                    role="tooltip"
                    className="absolute left-full ml-4 px-3 py-1.5 bg-[#1B0A37] text-white text-xs font-heading font-medium rounded-xl whitespace-nowrap shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none z-[100] flex items-center gap-1.5"
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-white/20 text-[#FDE88C] px-1.5 py-0.5 rounded-full font-mono">
                        {item.badge}
                      </span>
                    )}
                    {/* Tooltip left arrow pointer */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1B0A37]" />
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Actions: Settings and Logout with Hover Tooltips */}
      <div className="p-3 pb-6 flex flex-col gap-1.5 border-t border-white/5 overflow-visible">
        {/* Settings with Collapsed Hover Tooltip */}
        <Link
          to="/library/dashboard/settings"
          onClick={onItemClick}
          title={isCollapsed ? 'Settings' : undefined}
          className={`relative flex items-center px-3.5 py-3 rounded-xl font-medium text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 group ${
            isCollapsed ? 'justify-center' : 'gap-4'
          }`}
        >
          <FiSettings className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:rotate-45 text-white/60 stroke-[1.8]" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="tracking-wide overflow-hidden whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div
              role="tooltip"
              className="absolute left-full ml-4 px-3 py-1.5 bg-[#1B0A37] text-white text-xs font-heading font-medium rounded-xl whitespace-nowrap shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none z-[100] flex items-center"
            >
              <span>Settings</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1B0A37]" />
            </div>
          )}
        </Link>

        {/* Logout with Collapsed Hover Tooltip */}
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : undefined}
          className={`relative w-full flex items-center px-3.5 py-3 rounded-xl font-medium text-sm text-[#F87171] hover:text-[#EF4444] hover:bg-red-500/10 transition-all duration-200 text-left cursor-pointer group ${
            isCollapsed ? 'justify-center' : 'gap-4'
          }`}
        >
          <FiLogOut className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 stroke-[1.8]" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="tracking-wide overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div
              role="tooltip"
              className="absolute left-full ml-4 px-3 py-1.5 bg-red-950 text-red-200 text-xs font-heading font-medium rounded-xl whitespace-nowrap shadow-2xl border border-red-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none z-[100] flex items-center"
            >
              <span>Logout</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-950" />
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
