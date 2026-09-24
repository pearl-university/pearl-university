import type { FC } from 'react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiLogOut, FiUser, FiHelpCircle, FiCheckCircle } from 'react-icons/fi'
import { HiBars3 } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useUI } from '../../../context/UIContext'
import studentAvatarImg from '../../../assets/images/student-portal/john_offiong.jpg'

export interface StudentTopBarProps {
  onToggleMobileMenu: () => void
  title?: string
  subtitle?: string
}

export const StudentTopBar: FC<StudentTopBarProps> = ({
  onToggleMobileMenu,
  title = 'Dashboard',
  subtitle = 'Quick overview of the parts of the portal you have access to.',
}) => {
  const { user, logout } = useAuth()
  const { alert, confirm } = useUI()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotifsOpen, setIsNotifsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifsRef = useRef<HTMLDivElement>(null)

  const studentName = user?.name || 'John Offiong'
  const studentEmail = user?.email || 'john.offiong@pearl.edu.ng'

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setIsNotifsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Sign Out from Student Portal',
      message: 'Are you sure you want to end your current student session?',
      confirmText: 'Sign Out',
      cancelText: 'Stay Signed In',
      variant: 'warning',
    })

    if (confirmed) {
      logout()
      alert.info('Signed Out', 'You have been safely signed out of the Student Portal.')
      navigate('/student-portal')
    }
  }

  return (
    <header className="w-full bg-[#160829] text-white px-5 sm:px-8 py-5 flex items-center justify-between border-b border-white/10 shrink-0 select-none">
      {/* 1. Left: Mobile Toggle & Page Title / Subtitle */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          aria-label="Open navigation menu"
        >
          <HiBars3 className="w-6 h-6" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg sm:text-2xl md:text-[26px] font-heading font-normal tracking-tight text-white leading-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs sm:text-sm text-gray-400 font-normal mt-0.5 leading-tight">
            {subtitle}
          </p>
        </div>
      </div>

      {/* 2. Right: Notification Bell & Profile Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifsRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotifsOpen(!isNotifsOpen)
              setIsProfileOpen(false)
            }}
            className="p-2.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer relative"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#160829]" />
          </button>

          {/* Notifications Popover */}
          <AnimatePresence>
            {isNotifsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1f0d38] border border-white/15 rounded-2xl shadow-2xl p-4 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                    2 New
                  </span>
                </div>
                <div className="py-2 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer flex gap-3">
                    <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Course Registration Approved</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">
                        Your Level 100 first semester courses have been confirmed.
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer flex gap-3">
                    <FiBell className="w-4 h-4 text-[#FDE88C] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Faculty Dues Reminder</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">
                        Faculty dues are pending for 2025/2026 session.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar with dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen)
              setIsNotifsOpen(false)
            }}
            className="flex items-center gap-2 p-0.5 rounded-full ring-2 ring-white/20 hover:ring-white/50 transition cursor-pointer"
            aria-label="User profile menu"
          >
            <img
              src={studentAvatarImg}
              alt={studentName}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover object-top"
            />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 bg-[#1f0d38] border border-white/15 rounded-2xl shadow-2xl p-3 z-50"
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-sm font-semibold text-white truncate">{studentName}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{studentEmail}</p>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false)
                      alert.info('Profile', 'Student profile details loaded.')
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition cursor-pointer text-left"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>My Bio-Data Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate('/library/dashboard')
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition cursor-pointer text-left"
                  >
                    <FiHelpCircle className="w-4 h-4" />
                    <span>Switch to E-Library</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer text-left"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
