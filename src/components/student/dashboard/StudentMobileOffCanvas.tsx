import type { FC } from 'react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiXMark } from 'react-icons/hi2'
import { StudentSidebar } from './StudentSidebar'

export interface StudentMobileOffCanvasProps {
  isOpen: boolean
  onClose: () => void
}

export const StudentMobileOffCanvas: FC<StudentMobileOffCanvasProps> = ({
  isOpen,
  onClose,
}) => {
  // Prevent body scrolling when mobile offcanvas is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden flex">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Off-canvas Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-[85%] max-w-xs h-[100dvh] bg-[#150826] shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
              aria-label="Close navigation drawer"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            {/* Sidebar Contents */}
            <div className="h-full overflow-hidden">
              <StudentSidebar
                isCollapsed={false}
                onToggleCollapse={onClose}
                onItemClick={onClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
