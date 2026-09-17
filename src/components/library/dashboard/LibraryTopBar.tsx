import type { FC } from 'react'
import { useState } from 'react'
import {
  FiSearch,
  FiChevronDown,
  FiBell,
  FiMenu,
  FiUser,
  FiCheck,
  FiLogOut,
  FiShield,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { DEMO_CREDENTIALS } from '../../../utils/auth'
import { useAuth } from '../../../context/AuthContext'
import { useLibraryFilter } from '../../../context/LibraryFilterContext'

interface LibraryTopBarProps {
  onToggleMobileMenu: () => void
}

const PROGRAM_OPTIONS = ['Undergraduate', 'Postgraduate', 'Doctorate', 'Faculty Research']

export const LibraryTopBar: FC<LibraryTopBarProps> = ({
  onToggleMobileMenu,
}) => {
  const { user: authUser, logout } = useAuth()
  const user = authUser || DEMO_CREDENTIALS.user
  const {
    searchQuery,
    setSearchQuery,
    selectedProgram,
    setSelectedProgram,
    selectedFaculty,
    setSelectedFaculty,
    selectedDept,
    setSelectedDept,
    availableFaculties,
    availableDepartments,
  } = useLibraryFilter()

  const [openDropdown, setOpenDropdown] = useState<'program' | 'faculty' | 'dept' | 'user' | null>(null)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true)

  const handleLogout = async () => {
    setOpenDropdown(null)
    await logout()
  }

  const toggleDropdown = (key: 'program' | 'faculty' | 'dept') => {
    setOpenDropdown((prev) => (prev === key ? null : key))
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[#ECE0EF]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 border-b border-black/5 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 lg:gap-6">
        {/* Left Section: Mobile Menu Trigger + Program Selector + Filters */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
          {/* Mobile Off-canvas Hamburger Button */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open sidebar navigation"
            className="lg:hidden p-2 rounded-xl bg-white/70 hover:bg-white text-[#200441] border border-black/5 transition shadow-xs cursor-pointer shrink-0"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          {/* Program Pill Badge / Dropdown */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              type="button"
              onClick={() => toggleDropdown('program')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#200441] text-white rounded-full font-medium text-xs sm:text-[13px] tracking-wide hover:bg-[#2e065e] active:scale-95 transition-all shadow-md shadow-[#200441]/15 flex items-center gap-2 cursor-pointer"
            >
              <span>{selectedProgram}</span>
              <FiChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'program' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'program' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-black/10 p-2 z-50 overflow-hidden"
                >
                  {PROGRAM_OPTIONS.map((prog) => (
                    <button
                      key={prog}
                      type="button"
                      onClick={() => {
                        setSelectedProgram(prog)
                        setOpenDropdown(null)
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                        selectedProgram === prog
                          ? 'bg-[#ECE0EF] text-[#200441] font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{prog}</span>
                      {selectedProgram === prog && <FiCheck className="w-3.5 h-3.5 text-[#200441]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Input Bar matching screenshot */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter keyword"
              className="w-full pl-4 pr-10 py-2 sm:py-2.5 bg-white/70 hover:bg-white focus:bg-white rounded-full border border-black/20 focus:border-[#200441] focus:ring-2 focus:ring-[#200441]/20 text-xs sm:text-[13px] text-gray-800 placeholder:text-gray-500 transition-all font-normal outline-none shadow-xs"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <FiSearch className="w-4 h-4" />
            </div>
          </div>

          {/* Faculty Dropdown Filter (Derived automatically from assets/books/) */}
          <div className="relative shrink-0 hidden md:block">
            <button
              type="button"
              onClick={() => toggleDropdown('faculty')}
              className="px-4 py-2 sm:py-2.5 bg-white/60 hover:bg-white rounded-full border border-black/20 text-xs sm:text-[13px] text-gray-700 font-normal hover:text-black transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span className="truncate max-w-[140px]">
                {selectedFaculty === 'All Faculties' ? 'Faculty' : selectedFaculty}
              </span>
              <FiChevronDown
                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                  openDropdown === 'faculty' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'faculty' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-black/10 p-2 z-50 max-h-60 overflow-y-auto custom-scrollbar"
                >
                  {availableFaculties.map((fac) => (
                    <button
                      key={fac}
                      type="button"
                      onClick={() => {
                        setSelectedFaculty(fac)
                        setOpenDropdown(null)
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition truncate ${
                        selectedFaculty === fac
                          ? 'bg-[#ECE0EF] text-[#200441] font-semibold'
                          : 'text-gray-700 hover:bg-[#ECE0EF]/50 hover:text-[#200441]'
                      }`}
                    >
                      {fac}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Department Dropdown Filter (Derived automatically from assets/books/) */}
          <div className="relative shrink-0 hidden xl:block">
            <button
              type="button"
              onClick={() => toggleDropdown('dept')}
              className="px-4 py-2 sm:py-2.5 bg-white/60 hover:bg-white rounded-full border border-black/20 text-xs sm:text-[13px] text-gray-700 font-normal hover:text-black transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span className="truncate max-w-[140px]">
                {selectedDept === 'All Departments' ? 'Department' : selectedDept}
              </span>
              <FiChevronDown
                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                  openDropdown === 'dept' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'dept' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-black/10 p-2 z-50 max-h-60 overflow-y-auto custom-scrollbar"
                >
                  {availableDepartments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setSelectedDept(dept)
                        setOpenDropdown(null)
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition truncate ${
                        selectedDept === dept
                          ? 'bg-[#ECE0EF] text-[#200441] font-semibold'
                          : 'text-gray-700 hover:bg-[#ECE0EF]/50 hover:text-[#200441]'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section: User Avatar & Greeting & Notification Bell */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* User Profile Capsule with Interactive Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => (prev === 'user' ? null : 'user'))}
              className="flex items-center gap-2.5 sm:gap-3 bg-white/60 hover:bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-black/10 transition cursor-pointer shadow-xs"
              title="User Account & Options"
            >
              {/* Student Avatar matching screenshot s4.png */}
              <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full overflow-hidden border-2 border-emerald-500/80 shrink-0 shadow-xs bg-[#200441]">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                    <FiUser className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Greeting */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-gray-900 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {user.studentId}
                </span>
              </div>

              <FiChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 hidden sm:block ${
                  openDropdown === 'user' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {openDropdown === 'user' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-black/10 p-3 z-50 overflow-hidden"
                >
                  <div className="pb-3 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                    <p className="text-[11px] text-gray-500 font-mono">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-[#200441] bg-[#ECE0EF] px-2 py-0.5 rounded-md w-fit">
                      <FiShield className="w-3 h-3" />
                      <span>{user.faculty}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition cursor-pointer"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Sign Out to Portals</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => setHasUnreadNotifications(false)}
            aria-label="Library Notifications"
            className="relative p-2 rounded-full text-gray-700 hover:text-black hover:bg-black/5 transition cursor-pointer"
          >
            <FiBell className="w-5 h-5" />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
