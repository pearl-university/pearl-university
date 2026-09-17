import type { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiX,
  FiHome,
  FiBook,
  FiClock,
  FiBookmark,
  FiSettings,
  FiLogOut,
  FiUser,
  FiLayers,
} from 'react-icons/fi'
import logoSvg from '../../../assets/logo.svg'
import { useAuth } from '../../../context/AuthContext'
import { DEMO_CREDENTIALS } from '../../../utils/auth'

interface LibraryMobileOffCanvasProps {
  isOpen: boolean
  onClose: () => void
}

const PRIMARY_NAV = [
  { name: 'Home', href: '/library/dashboard', icon: FiHome },
  { name: 'Library', href: '/library/dashboard/catalogue', icon: FiBook },
  { name: 'Reads', href: '/library/dashboard/reads', icon: FiClock },
  { name: 'Saved', href: '/library/dashboard/saved', icon: FiBookmark },
]

export const LibraryMobileOffCanvas: FC<LibraryMobileOffCanvasProps> = ({
  isOpen,
  onClose,
}) => {
  const location = useLocation()
  const { user: authUser, logout } = useAuth()
  const user = authUser || DEMO_CREDENTIALS.user

  const handleLogout = async () => {
    onClose()
    await logout()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-over Drawer (100vh inner scroll) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-80 max-w-[85vw] h-screen max-h-screen bg-[#1B0A37] text-white flex flex-col justify-between overflow-y-auto custom-scrollbar border-r border-white/10 z-10 shadow-2xl"
          >
            {/* Top section: Header & Profile & Mobile Filters & Nav */}
            <div className="p-6 flex flex-col gap-6">
              {/* Logo & Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <Link
                  to="/library/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md shrink-0">
                    <img
                      src={logoSvg}
                      alt="Pearl University Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-xs font-semibold tracking-wide text-white leading-tight">
                      PEARL UNIVERSITY
                    </span>
                    <span className="text-[9px] text-white/50 tracking-wider font-light uppercase mt-0.5">
                      Digital e-Library
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Student Profile Capsule (Items not fitted on top-bar on mobile) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/80 shrink-0 bg-[#200441]">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <FiUser className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-white truncate">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-[#FDE88C] font-mono truncate">
                    {user.studentId}
                  </span>
                  <span className="text-[10px] text-white/60 truncate mt-0.5">
                    {user.faculty}
                  </span>
                </div>
              </div>

              {/* Mobile Program Tag */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">
                  Level:
                </span>
                <span className="px-3 py-1 rounded-full bg-[#200441] text-[#FDE88C] border border-[#FDE88C]/30 text-xs font-medium inline-flex items-center gap-1.5">
                  <FiLayers className="w-3 h-3" />
                  {user.program}
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1.5 pt-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 px-3 pb-1">
                  Menu Navigation
                </span>
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
                      onClick={onClose}
                      className={`relative flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        isActive
                          ? 'text-white bg-white/10 font-semibold'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full" />
                      )}
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Section: Settings & Logout */}
            <div className="p-6 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/library/dashboard/settings"
                onClick={onClose}
                className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
              >
                <FiSettings className="w-5 h-5 shrink-0" />
                <span>Settings</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm text-[#F87171] hover:text-[#EF4444] hover:bg-red-500/10 transition text-left cursor-pointer"
              >
                <FiLogOut className="w-5 h-5 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
