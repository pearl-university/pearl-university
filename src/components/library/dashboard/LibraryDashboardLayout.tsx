import type { FC, ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { LibrarySidebar } from './LibrarySidebar'
import { LibraryTopBar } from './LibraryTopBar'
import { LibraryMobileOffCanvas } from './LibraryMobileOffCanvas'
import { BottomPillLoader } from '../../ui/BottomPillLoader'
import { AlertToastsContainer } from '../../ui/AlertToasts'
import { ConfirmModal } from '../../ui/ConfirmModal'

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'pearl_sidebar_collapsed'

export const LibraryDashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next))
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
    <div className="min-h-screen w-full flex bg-[#1B0A37] text-gray-900 font-sans antialiased overflow-hidden">
      {/* 1. Desktop Side Navigation (Collapsible, 100vh with inner scroll) */}
      <div className="hidden lg:flex shrink-0">
        <LibrarySidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {/* 2. Mobile Off-Canvas Navigation Drawer (100vh with inner scroll) */}
      <LibraryMobileOffCanvas
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 3. Main Dashboard Viewport */}
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden bg-[#ECE0EF] lg:rounded-tl-[36px] shadow-2xl transition-all duration-300">
        {/* Sticky Top Bar (Not part of scrollable content) */}
        <LibraryTopBar onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Global UI Elements for Dashboard */}
      <BottomPillLoader />
      <AlertToastsContainer />
      <ConfirmModal />
    </div>
  )
}

