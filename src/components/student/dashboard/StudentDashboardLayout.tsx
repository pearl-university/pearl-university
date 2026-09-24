import type { FC, ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { StudentSidebar } from './StudentSidebar'
import { StudentTopBar } from './StudentTopBar'
import { StudentMobileOffCanvas } from './StudentMobileOffCanvas'
import { BottomPillLoader } from '../../ui/BottomPillLoader'
import { AlertToastsContainer } from '../../ui/AlertToasts'
import { ConfirmModal } from '../../ui/ConfirmModal'

const STUDENT_SIDEBAR_COLLAPSED_KEY = 'pearl_student_sidebar_collapsed'

export interface StudentDashboardLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export const StudentDashboardLayout: FC<StudentDashboardLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STUDENT_SIDEBAR_COLLAPSED_KEY) === 'true'
    } catch {
      return false
    }
  })

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STUDENT_SIDEBAR_COLLAPSED_KEY, String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Handle keyboard shortcut (Ctrl/Cmd + B) to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        toggleCollapse()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen w-full flex bg-[#160829] text-white font-sans antialiased overflow-hidden">
      {/* 1. Desktop Side Navigation (Collapsible, 100vh with inner scroll) */}
      <div className="hidden lg:flex shrink-0 z-50 relative overflow-visible">
        <StudentSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {/* 2. Mobile Off-Canvas Navigation Drawer */}
      <StudentMobileOffCanvas
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 3. Main Dashboard Viewport */}
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden bg-[#160829]">
        {/* Sticky Top Bar */}
        <StudentTopBar
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Global UI Elements */}
      <BottomPillLoader />
      <AlertToastsContainer />
      <ConfirmModal />
    </div>
  )
}
