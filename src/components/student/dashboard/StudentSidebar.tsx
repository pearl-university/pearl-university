import type { FC } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineCreditCard,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineQuestionMarkCircle,
  HiOutlineClipboardDocumentCheck,
  HiOutlineChartBar,
} from 'react-icons/hi2'
import { FiGrid, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import logoSvg from '../../../assets/logo.svg'

interface NavItem {
  id: string
  name: string
  href: string
  icon: typeof FiGrid | typeof HiOutlineCreditCard
}

interface NavSection {
  id: string
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'admissions',
    title: 'ADMISSIONS',
    items: [
      {
        id: 'acceptance-fee',
        name: 'Pay Acceptance Fee',
        href: '/student/dashboard/acceptance-fee',
        icon: HiOutlineCreditCard,
      },
      {
        id: 'online-screening',
        name: 'Online screening',
        href: '/student/dashboard/screening',
        icon: HiOutlineClipboardDocumentCheck,
      },
    ],
  },
  {
    id: 'finance',
    title: 'FINANCE',
    items: [
      {
        id: 'pay-school-fees',
        name: 'Pay School Fees',
        href: '/student/dashboard#school-fees',
        icon: HiOutlineCreditCard,
      },
      {
        id: 'pay-dues-levies',
        name: 'Pay Dues & Levies',
        href: '/student/dashboard#dues',
        icon: HiOutlineCreditCard,
      },
      {
        id: 'payment-receipts',
        name: 'Payment Receipts',
        href: '/student/dashboard#receipts',
        icon: HiOutlineDocumentText,
      },
    ],
  },
  {
    id: 'academics',
    title: 'ACADEMICS',
    items: [
      {
        id: 'course-reg',
        name: 'Course Registration',
        href: '/student/dashboard#course-reg',
        icon: HiOutlineAcademicCap,
      },
      {
        id: 'my-courses',
        name: 'My Courses',
        href: '/student/dashboard#my-courses',
        icon: HiOutlineBookOpen,
      },
      {
        id: 'my-results',
        name: 'My Results',
        href: '/student/dashboard#results',
        icon: HiOutlineChartBar,
      },
    ],
  },
  {
    id: 'helpdesk',
    title: 'HELPDESK',
    items: [
      {
        id: 'help-support',
        name: 'Help & Support',
        href: '/student/dashboard#help',
        icon: HiOutlineQuestionMarkCircle,
      },
    ],
  },
]

export interface StudentSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onItemClick?: () => void
}

export const StudentSidebar: FC<StudentSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onItemClick,
}) => {
  const location = useLocation()
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const isDashboardActive =
    (location.pathname === '/student/dashboard' ||
      location.pathname === '/student/dashboard/' ||
      location.pathname === '/student-dashboard') &&
    location.hash === ''

  const checkItemActive = (item: NavItem) => {
    if (item.id === 'acceptance-fee') {
      return (
        location.pathname.includes('acceptance-fee') ||
        location.hash === '#acceptance-fee'
      )
    }
    if (item.id === 'online-screening') {
      return location.pathname.includes('screening') || location.hash === '#screening'
    }
    if (item.id === 'pay-school-fees') {
      return location.pathname.includes('school-fees') || location.hash === '#school-fees'
    }
    if (item.id === 'pay-dues-levies') {
      return location.pathname.includes('dues') || location.hash === '#dues'
    }
    if (item.id === 'payment-receipts') {
      return location.pathname.includes('receipt') || location.hash === '#receipts'
    }
    if (item.id === 'course-reg') {
      return location.pathname.includes('course-reg') || location.hash === '#course-reg'
    }
    if (item.id === 'my-courses') {
      return location.pathname.includes('my-courses') || location.hash === '#my-courses'
    }
    if (item.id === 'my-results') {
      return location.pathname.includes('results') || location.hash === '#results'
    }
    if (item.id === 'help-support') {
      return location.pathname.includes('help') || location.hash === '#help'
    }
    return location.pathname === item.href
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen max-h-screen sticky top-0 shrink-0 bg-[#150826] text-white flex flex-col justify-between overflow-visible border-r border-white/10 select-none z-50 relative"
      aria-label="Student Navigation Sidebar"
    >
      {/* 1. Floating Collapse/Expand Toggle at Top Right Border */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute -right-3.5 top-6 z-[60] w-7 h-7 rounded-full bg-[#150826] border border-white/20 text-white hover:text-[#FDE88C] shadow-xl items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all"
          title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
        >
          {isCollapsed ? (
            <FiChevronRight className="w-3.5 h-3.5" />
          ) : (
            <FiChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {/* 2. Top Header / Logo Section */}
      <div className="flex flex-col overflow-visible">
        <div
          className={`p-4 sm:p-5 border-b border-white/10 flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <Link
            to="/student/dashboard"
            onClick={onItemClick}
            className={`flex items-center gap-3 group focus:outline-none overflow-hidden ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Pearl University Student Portal"
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
                  className="flex flex-col overflow-hidden whitespace-nowrap text-left"
                >
                  <span className="font-heading text-xs font-bold tracking-wider text-white leading-tight">
                    PEARL UNIVERSITY
                  </span>
                  <span className="text-[10px] text-gray-400 font-light tracking-wide uppercase mt-0.5">
                    Building value
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* 3. Navigation Links List */}
        <div
          className={`py-5 px-3 space-y-6 max-h-[calc(100vh-80px)] ${
            isCollapsed
              ? 'overflow-visible'
              : 'overflow-y-auto overflow-x-hidden custom-scrollbar'
          }`}
        >
          {/* Top-Level Dashboard Nav Link */}
          <div className="relative">
            <Link
              to="/student/dashboard"
              onClick={onItemClick}
              className={`relative flex items-center px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'gap-3.5'
              } ${
                isDashboardActive
                  ? 'text-white bg-[#2f1652] border border-white/20 shadow-md font-bold'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent font-medium'
              }`}
            >
              {/* Active Left Indicator Bar */}
              {isDashboardActive && (
                <motion.span
                  layoutId="student-active-indicator"
                  className={`absolute bg-white rounded-r-full shadow-md shadow-white/50 ${
                    isCollapsed
                      ? '-left-1.5 top-2.5 bottom-2.5 w-1.5'
                      : '-left-3 top-1.5 bottom-1.5 w-1.5'
                  }`}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <FiGrid
                className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isDashboardActive
                    ? 'text-white stroke-[2.2]'
                    : 'text-gray-300 group-hover:text-white'
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
                    Dashboard
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Collapsed Hover Tooltip */}
              {isCollapsed && (
                <div
                  role="tooltip"
                  className="absolute left-full ml-4 px-3.5 py-1.5 bg-[#241142] text-white text-xs font-heading font-medium rounded-xl whitespace-nowrap shadow-2xl border border-white/25 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none z-[9999] flex items-center drop-shadow-2xl"
                >
                  <span>Dashboard</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#241142]" />
                </div>
              )}
            </Link>
          </div>

          {/* Grouped Category Sections */}
          {NAV_SECTIONS.map((section) => {
            const isSectionCollapsed = Boolean(collapsedSections[section.id])

            return (
              <div key={section.id} className="space-y-1.5 relative overflow-visible">
                {/* Section Header */}
                {!isCollapsed && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-semibold text-gray-400/90 tracking-wider uppercase hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    <span>{section.title}</span>
                    <span className="text-gray-500 text-xs font-mono">—</span>
                  </button>
                )}

                {/* Section Nav Items */}
                {!isSectionCollapsed && (
                  <div className="space-y-1 relative overflow-visible">
                    {section.items.map((item) => {
                      const IconComponent = item.icon
                      const isActive = checkItemActive(item)

                      return (
                        <div key={item.id} className="relative">
                          <Link
                            to={item.href}
                            onClick={onItemClick}
                            className={`relative flex items-center px-3.5 py-2.5 rounded-xl text-xs sm:text-[13.5px] transition-all duration-200 group ${
                              isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'gap-3.5'
                            } ${
                              isActive
                                ? 'text-white bg-[#2f1652] border border-white/20 shadow-md font-bold'
                                : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent font-medium'
                            }`}
                          >
                            {/* Active Left Indicator Bar */}
                            {isActive && (
                              <motion.span
                                layoutId="student-active-indicator"
                                className={`absolute bg-white rounded-r-full shadow-md shadow-white/50 ${
                                  isCollapsed
                                    ? '-left-1.5 top-2.5 bottom-2.5 w-1.5'
                                    : '-left-3 top-1.5 bottom-1.5 w-1.5'
                                }`}
                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                              />
                            )}

                            <IconComponent
                              className={`w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                isActive
                                  ? 'text-white stroke-[2.2]'
                                  : 'text-gray-300 group-hover:text-white'
                              }`}
                            />

                            <AnimatePresence>
                              {!isCollapsed && (
                                <motion.span
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: 'auto' }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="truncate whitespace-nowrap"
                                >
                                  {item.name}
                                </motion.span>
                              )}
                            </AnimatePresence>

                            {/* Desktop Collapsed Hover Tooltip with Arrow Pointer */}
                            {isCollapsed && (
                              <div
                                role="tooltip"
                                className="absolute left-full ml-4 px-3.5 py-1.5 bg-[#241142] text-white text-xs font-heading font-medium rounded-xl whitespace-nowrap shadow-2xl border border-white/25 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none z-[9999] flex items-center drop-shadow-2xl"
                              >
                                <span>{item.name}</span>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#241142]" />
                              </div>
                            )}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </motion.aside>
  )
}
