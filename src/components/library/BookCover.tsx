import { type FC, useEffect, useState, useRef } from 'react'
import { HiBookOpen } from 'react-icons/hi2'
import {
  extractFirstPageCover,
  getCachedCoverSync,
} from '../../utils/pdfCoverExtractor'

interface BookCoverProps {
  pdfUrl?: string
  title: string
  author: string
  faculty?: string
  department?: string
  className?: string
  aspectRatio?: string // e.g. 'aspect-[3/4.2]'
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
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Instant synchronous memory cache check
  const syncCover = pdfUrl ? getCachedCoverSync(pdfUrl) : null
  const [coverUrl, setCoverUrl] = useState<string | null>(syncCover)
  const [isInView, setIsInView] = useState<boolean>(false)
  const [imgLoaded, setImgLoaded] = useState<boolean>(Boolean(syncCover))

  // 1. Viewport IntersectionObserver to only load covers that are visible
  useEffect(() => {
    if (coverUrl || !pdfUrl) return

    const node = containerRef.current
    if (!node) return

    // If IntersectionObserver is not supported, load immediately
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '180px', // Pre-fetch slightly before entering viewport
        threshold: 0.01,
      }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [coverUrl, pdfUrl])

  // 2. Extract cover when item enters viewport
  useEffect(() => {
    if (!isInView || !pdfUrl || coverUrl) {
      return
    }

    const abortController = new AbortController()
    let isMounted = true

    extractFirstPageCover(pdfUrl, 0.55, abortController.signal)
      .then((dataUrl) => {
        if (isMounted) {
          setCoverUrl(dataUrl)
        }
      })
      .catch((err) => {
        // Silently keep styled book jacket on abort, timeout, or range error
        if (err?.name !== 'AbortError') {
          // Fallback gracefully without throwing
        }
      })

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [isInView, pdfUrl, coverUrl])

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectRatio} overflow-hidden rounded-xl shadow-xs border border-black/5 group-hover:shadow-md transition-all duration-300 bg-[#1B0A37] select-none ${className}`}
    >
      {/* ── Base Styled Book Jacket (Fallback Placeholder while loading or if no cover) ── */}
      {!imgLoaded && (
        <div className="absolute inset-0 flex flex-col justify-between p-2.5 sm:p-3 bg-gradient-to-br from-[#1B0A37] via-[#200441] to-[#381561] text-white">
          {/* Book Spine Crease Shadow */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

          {/* Top Micro Badge */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider font-semibold text-[#FDE88C] truncate max-w-[82%]">
              {department || faculty || 'Pearl Library'}
            </span>
            <HiBookOpen className="w-3.5 h-3.5 text-[#FDE88C]/80 shrink-0" />
          </div>

          {/* Center Title */}
          <div className="my-auto py-1">
            <div className="w-4 h-0.5 bg-[#FDE88C] mb-1.5 rounded-full" />
            <h4 className="font-heading font-medium text-xs leading-tight text-white line-clamp-3">
              {title}
            </h4>
          </div>

          {/* Bottom Author */}
          <div className="pt-1 border-t border-white/10 text-[9px] text-[#FDE88C]/90 truncate">
            {author}
          </div>
        </div>
      )}

      {/* ── Clean Extracted PDF Cover Layer (No text overlay once loaded) ── */}
      {coverUrl && (
        <div
          className={`absolute inset-0 z-10 bg-white transition-opacity duration-300 ease-out ${
            imgLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={coverUrl}
            alt={`Cover of ${title}`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(false)}
            loading="lazy"
          />

          {/* Subtle Spine Crease Shadow for Realistic Book Depth */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />

          {/* Subtle Hover Gloss */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/15 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
    </div>
  )
}

