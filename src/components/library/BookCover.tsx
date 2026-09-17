import { type FC, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiBookOpen } from 'react-icons/hi2'
import { extractFirstPageCover } from '../../utils/pdfCoverExtractor'

interface BookCoverProps {
  pdfUrl?: string
  title: string
  author: string
  faculty?: string
  department?: string
  className?: string
  aspectRatio?: string // e.g. 'aspect-[3/4]'
}

export const BookCover: FC<BookCoverProps> = ({
  pdfUrl,
  title,
  author,
  faculty,
  department,
  className = '',
  aspectRatio = 'aspect-[3/4.2]',
}) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(pdfUrl))
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true

    if (!pdfUrl) {
      return
    }

    extractFirstPageCover(pdfUrl)
      .then((dataUrl) => {
        if (isMounted) {
          setCoverUrl(dataUrl)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.warn(`Cover extraction fallback for "${title}":`, err)
        if (isMounted) {
          setHasError(true)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [pdfUrl, title])

  return (
    <div
      className={`relative w-full ${aspectRatio} overflow-hidden rounded-xl shadow-xs border border-black/5 group-hover:shadow-md transition-all duration-300 bg-[#E8DDEB]/60 ${className}`}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          /* ── YouTube-Style Skeleton Shimmer Loader ─────────────── */
          <motion.div
            key="shimmer-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#E2D5E6] to-[#ECE0EF] flex flex-col justify-between p-2.5"
          >
            {/* YouTube Shimmer Wave */}
            <div className="animate-shimmer pointer-events-none" />

            {/* Subtle Spine Accent */}
            <div className="absolute inset-y-0 left-0 w-2 bg-[#200441]/10 pointer-events-none" />

            {/* Skeleton Pill (Header) */}
            <div className="w-2/3 h-2.5 rounded-full bg-white/60 mb-2" />

            {/* Center Book Silhouette Icon */}
            <div className="my-auto mx-auto flex items-center justify-center w-8 h-8 rounded-full bg-white/40 text-[#200441]/30">
              <HiBookOpen className="w-4 h-4" />
            </div>

            {/* Skeleton Text Lines */}
            <div className="space-y-1.5 pt-2">
              <div className="w-5/6 h-2 rounded-full bg-white/60" />
              <div className="w-1/2 h-2 rounded-full bg-white/40" />
            </div>
          </motion.div>
        ) : coverUrl && !hasError ? (
          /* ── Real Extracted PDF First-Page Cover ──────────────── */
          <motion.div
            key="real-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full relative bg-white flex items-center justify-center"
          >
            <img
              src={coverUrl}
              alt={`Cover of ${title}`}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
              loading="lazy"
            />

            {/* Book Spine Crease Shadow Overlay */}
            <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />

            {/* Subtle gloss hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ) : (
          /* ── Minimal Responsive Fallback Book Jacket ─────────── */
          <motion.div
            key="styled-jacket"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative flex flex-col justify-between p-2.5 bg-gradient-to-br from-[#1B0A37] via-[#200441] to-[#35145D] text-white overflow-hidden"
          >
            {/* Book Spine Crease */}
            <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

            {/* Top Micro Badge */}
            <div className="relative z-10 flex items-center justify-between gap-1">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#FDE88C] truncate max-w-[80%]">
                {department || faculty || 'Pearl Uni'}
              </span>
              <HiBookOpen className="w-3.5 h-3.5 text-[#FDE88C]/80 shrink-0" />
            </div>

            {/* Center Title */}
            <div className="relative z-10 my-auto py-1">
              <div className="w-4 h-0.5 bg-[#FDE88C] mb-1.5 rounded-full" />
              <h4 className="font-heading font-medium text-xs leading-tight text-white line-clamp-2">
                {title}
              </h4>
            </div>

            {/* Bottom Author */}
            <div className="relative z-10 pt-1 border-t border-white/10 text-[9px] text-[#FDE88C]/90 truncate">
              {author}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
