import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface BaseModalProps {
  /** Controls visibility of the modal */
  isOpen: boolean
  /** Callback fired when modal requests to close (backdrop click, ESC key) */
  onClose: () => void
  /** Whether clicking outside the modal content triggers onClose (default: true) */
  clickOutsideToClose?: boolean
  /** Whether pressing Escape triggers onClose (default: true) */
  closeOnEsc?: boolean
  /** The inner content of the modal. No predefined headers, titles, or close icons are rendered. */
  children: ReactNode
  /** Custom CSS classes for the modal content card container */
  className?: string
  /** Custom CSS classes for the backdrop overlay */
  overlayClassName?: string
  /** Custom CSS classes for the outer fixed viewport wrapper */
  containerClassName?: string
}

export const BaseModal: FC<BaseModalProps> = ({
  isOpen,
  onClose,
  clickOutsideToClose = true,
  closeOnEsc = true,
  children,
  className = 'bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl p-6 sm:p-8 w-full max-w-xl relative overflow-hidden text-gray-900',
  overlayClassName = 'bg-black/60 backdrop-blur-xs',
  containerClassName = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto',
}) => {
  // Lock body scroll when modal is open
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

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEsc, onClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && clickOutsideToClose) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className={containerClassName}
          onClick={handleBackdropClick}
        >
          {/* Backdrop with Fade-In / Fade-Out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed inset-0 ${overlayClassName} -z-10`}
            aria-hidden="true"
          />

          {/* Modal Container with Fade-In & Subtle Scale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={className}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
