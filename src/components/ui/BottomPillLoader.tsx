import type { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUI } from '../../context/UIContext'

export const BottomPillLoader: FC = () => {
  const { loader } = useUI()

  return (
    <AnimatePresence>
      {loader.isVisible && (
        <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none select-none">
          <motion.div
            initial={{ y: 45, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 35, opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-[#141416]/95 backdrop-blur-md border border-white/20 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full shadow-2xl shadow-black/40 flex items-center gap-3.5"
            role="status"
            aria-live="polite"
          >
            {/* Custom Activity Indicator Spinner */}
            <div className="relative w-5 h-5 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-[#FDE88C] animate-spin" />
            </div>

            {/* Loading text */}
            <span className="font-medium text-xs sm:text-sm text-white tracking-wide">
              {loader.text}
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
