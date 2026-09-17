import { type FC, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiArrowLeft,
  HiChevronLeft,
  HiChevronRight,
  HiMagnifyingGlassMinus,
  HiMagnifyingGlassPlus,
  HiArrowsPointingOut,
  HiArrowsPointingIn,
  HiOutlineSun,
  HiOutlineMoon,
  HiListBullet,
  HiXMark,
  HiArrowDownTray,
  HiBookOpen,
  HiAcademicCap,
  HiSparkles,
  HiEllipsisVertical,
} from 'react-icons/hi2'
import { pdfjsLib } from '../../../utils/pdfWorkerInit'
import { getReadingProgress, saveReadingProgress } from '../../../utils/readingProgress'
import type { BookMetadata } from '../../../utils/bookScanner'

interface LibraryPdfReaderProps {
  book: BookMetadata
  onClose: () => void
}

interface TocItem {
  title: string
  pageNumber?: number
  items?: TocItem[]
}

export const LibraryPdfReader: FC<LibraryPdfReaderProps> = ({ book, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Retrieve initial saved progress lazily
  const initialSaved = useMemo(() => getReadingProgress(book.id), [book.id])

  // PDF state
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(() => initialSaved?.page || 1)
  const [pageInput, setPageInput] = useState<string>(() => String(initialSaved?.page || 1))
  
  // Responsive default scale calculation
  const [scale, setScale] = useState<number>(() => {
    if (initialSaved?.zoom) return initialSaved.zoom
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 0.95
    }
    return 1.2
  })
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadingProgress, setLoadingProgress] = useState<number>(10)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Viewer Preferences
  const [themeMode, setThemeMode] = useState<'light' | 'sepia' | 'dark'>(
    () => initialSaved?.themeMode || 'light'
  )
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const activeRenderTaskRef = useRef<pdfjsLib.RenderTask | null>(null)

  // Save progress on page / zoom / theme change
  useEffect(() => {
    if (totalPages > 0 && currentPage > 0) {
      saveReadingProgress(book.id, {
        page: currentPage,
        totalPages,
        zoom: scale,
        themeMode,
      })
    }
  }, [book.id, currentPage, totalPages, scale, themeMode])

  // Load PDF Document
  useEffect(() => {
    let isMounted = true

    const loadingTask = pdfjsLib.getDocument({
      url: book.fileUrl,
      disableFontFace: false,
      cMapPacked: true,
    })

    loadingTask.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
      if (total > 0 && isMounted) {
        const percent = Math.min(90, Math.round((loaded / total) * 100))
        setLoadingProgress(percent)
      }
    }

    loadingTask.promise
      .then(async (doc) => {
        if (!isMounted) return
        setPdfDoc(doc)
        setTotalPages(doc.numPages)
        setLoadingProgress(100)
        setIsLoading(false)

        // Extract TOC / Outline
        try {
          const outline = await doc.getOutline()
          if (outline && outline.length > 0) {
            const parsedOutline: TocItem[] = []
            for (const item of outline) {
              let targetPage = 1
              if (item.dest) {
                if (typeof item.dest === 'string') {
                  const dest = await doc.getDestination(item.dest)
                  if (dest && dest[0]) {
                    const pageIndex = await doc.getPageIndex(dest[0])
                    targetPage = pageIndex + 1
                  }
                } else if (Array.isArray(item.dest) && item.dest[0]) {
                  const pageIndex = await doc.getPageIndex(item.dest[0])
                  targetPage = pageIndex + 1
                }
              }
              parsedOutline.push({
                title: item.title,
                pageNumber: targetPage,
              })
            }
            if (isMounted) setTocItems(parsedOutline)
          }
        } catch {
          // TOC extraction failed or not present, ignore
        }
      })
      .catch((err) => {
        console.error('Error loading PDF:', err)
        if (isMounted) {
          setErrorMessage('Failed to load PDF document. Please try again or download for offline reading.')
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
      loadingTask.destroy()
    }
  }, [book.fileUrl])

  // Render single page onto Canvas preserving exact aspect ratio
  const renderSinglePage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || !canvasRef.current) return

      try {
        if (activeRenderTaskRef.current) {
          activeRenderTaskRef.current.cancel()
        }

        const page = await pdfDoc.getPage(pageNum)
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) return

        // Support Retina / High DPI
        const pixelRatio = window.devicePixelRatio || 1
        const viewport = page.getViewport({ scale: scale * pixelRatio })

        canvas.width = viewport.width
        canvas.height = viewport.height

        const cssWidth = viewport.width / pixelRatio
        const cssHeight = viewport.height / pixelRatio

        // Set dimensions and enforce strict aspect ratio to prevent squishing on mobile
        canvas.style.width = '100%'
        canvas.style.maxWidth = `${cssWidth}px`
        canvas.style.height = 'auto'
        canvas.style.aspectRatio = `${cssWidth} / ${cssHeight}`

        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const task = page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        })

        activeRenderTaskRef.current = task
        await task.promise
      } catch (err: unknown) {
        if ((err as { name?: string })?.name !== 'RenderingCancelledException') {
          console.error('Render page error:', err)
        }
      }
    },
    [pdfDoc, scale]
  )

  // Trigger render on page or scale update
  useEffect(() => {
    if (pdfDoc) {
      renderSinglePage(currentPage)
    }
  }, [pdfDoc, currentPage, scale, renderSinglePage])

  // Page Navigation Handlers
  const goToPage = useCallback(
    (num: number) => {
      const validPage = Math.max(1, Math.min(totalPages, num))
      setCurrentPage(validPage)
      setPageInput(String(validPage))
    },
    [totalPages]
  )

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }, [currentPage, totalPages, goToPage])

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }, [currentPage, goToPage])

  const handleZoomIn = useCallback(() => setScale((prev) => Math.min(3.0, Number((prev + 0.15).toFixed(2)))), [])
  const handleZoomOut = useCallback(() => setScale((prev) => Math.max(0.5, Number((prev - 0.15).toFixed(2)))), [])
  const handleZoomReset = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setScale(0.95)
    } else {
      setScale(1.2)
    }
  }, [])

  const handleFitWidth = useCallback(() => {
    if (canvasContainerRef.current) {
      const containerWidth = canvasContainerRef.current.clientWidth - (window.innerWidth < 640 ? 24 : 48)
      setScale(Math.max(0.6, Math.min(2.5, Number((containerWidth / 620).toFixed(2)))))
    }
  }, [])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }, [])

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        handleNextPage()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        handlePrevPage()
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        handleZoomIn()
      } else if (e.key === '-') {
        e.preventDefault()
        handleZoomOut()
      } else if (e.key === '0') {
        e.preventDefault()
        handleZoomReset()
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {})
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNextPage, handlePrevPage, handleZoomIn, handleZoomOut, handleZoomReset, toggleFullscreen, onClose])

  // Compute theme CSS styles
  const currentTheme = useMemo(() => {
    switch (themeMode) {
      case 'sepia':
        return {
          containerBg: 'bg-[#F4ECD8]',
          canvasFilter: 'sepia(0.35) contrast(0.95) brightness(0.96)',
          textColor: 'text-[#433422]',
        }
      case 'dark':
        return {
          containerBg: 'bg-[#120724]',
          canvasFilter: 'invert(0.92) hue-rotate(180deg) brightness(0.95)',
          textColor: 'text-[#ECE0EF]',
        }
      default:
        return {
          containerBg: 'bg-[#ECE0EF]',
          canvasFilter: 'none',
          textColor: 'text-[#1B0A37]',
        }
    }
  }, [themeMode])

  const readPercent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-[#1B0A37] text-white select-none overflow-hidden"
    >
      {/* ── TOP NAV / TOOLBAR ─────────────────────────────────── */}
      <header className="h-14 sm:h-16 px-3 sm:px-4 flex items-center justify-between border-b border-white/10 bg-[#1B0A37] shrink-0 shadow-lg z-20">
        {/* Left: Close & Book Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[50%] sm:max-w-[35%]">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs sm:text-sm font-medium shrink-0 cursor-pointer"
            title="Return to Library (Esc)"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="flex flex-col min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold truncate text-white leading-tight">
              {book.title}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#FDE88C] truncate">
              <span className="truncate">{book.author}</span>
              <span className="opacity-40 hidden sm:inline">•</span>
              <span className="opacity-80 shrink-0 hidden sm:inline">{book.coreArea}</span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Page Controls & Jump */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Previous Page (Left Arrow)"
          >
            <HiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              goToPage(parseInt(pageInput) || currentPage)
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm"
          >
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(String(currentPage))}
              className="w-10 sm:w-12 px-1.5 py-1 text-center font-mono rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FDE88C]"
            />
            <span className="text-white/60">/ {totalPages || 1}</span>
          </form>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Next Page (Right Arrow)"
          >
            <HiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Reading Progress Badge */}
          <div className="hidden lg:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-[#FDE88C]/15 border border-[#FDE88C]/30 text-[#FDE88C] text-[11px] font-semibold">
            <HiSparkles className="w-3.5 h-3.5" />
            <span>{readPercent}% complete</span>
          </div>
        </div>

        {/* Right: Theme Mode, TOC, Options */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Zoom Controls */}
          <div className="hidden md:flex items-center rounded-lg bg-white/10 p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white/15 rounded text-white/80 hover:text-white cursor-pointer"
              title="Zoom Out (-)"
            >
              <HiMagnifyingGlassMinus className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 py-1 text-xs font-mono text-white/90 hover:text-[#FDE88C] cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white/15 rounded text-white/80 hover:text-white cursor-pointer"
              title="Zoom In (+)"
            >
              <HiMagnifyingGlassPlus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleFitWidth}
            className="hidden lg:inline-flex px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white/90 cursor-pointer"
            title="Fit to Width"
          >
            Fit Width
          </button>

          {/* Theme Modes (Visible on both Mobile & Desktop) */}
          <div className="flex items-center rounded-lg bg-white/10 p-0.5">
            <button
              onClick={() => setThemeMode('light')}
              className={`p-1.5 sm:px-2 sm:py-1 rounded text-xs transition-colors cursor-pointer ${
                themeMode === 'light' ? 'bg-white text-[#1B0A37] font-bold' : 'text-white/70 hover:text-white'
              }`}
              title="Light Mode"
            >
              <HiOutlineSun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('sepia')}
              className={`p-1.5 sm:px-2 sm:py-1 rounded text-xs transition-colors cursor-pointer ${
                themeMode === 'sepia' ? 'bg-[#E3D7BF] text-[#433422] font-bold' : 'text-white/70 hover:text-white'
              }`}
              title="Sepia Eye-Comfort"
            >
              <span className="hidden sm:inline">Sepia</span>
              <span className="sm:hidden font-serif text-[11px] font-bold px-0.5">S</span>
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-1.5 sm:px-2 sm:py-1 rounded text-xs transition-colors cursor-pointer ${
                themeMode === 'dark' ? 'bg-[#3B1466] text-[#FDE88C] font-bold' : 'text-white/70 hover:text-white'
              }`}
              title="Dark Night Study"
            >
              <HiOutlineMoon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table of Contents Drawer Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
              isSidebarOpen ? 'bg-[#FDE88C] text-[#1B0A37]' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Table of Contents & Chapters"
          >
            <HiListBullet className="w-4 h-4" />
          </button>

          {/* Download Original PDF (Desktop) */}
          <a
            href={book.fileUrl}
            download={book.fileName}
            className="hidden sm:inline-flex p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            title="Download PDF"
          >
            <HiArrowDownTray className="w-4 h-4" />
          </a>

          {/* Fullscreen Toggle (Desktop) */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:inline-flex p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? (
              <HiArrowsPointingIn className="w-4 h-4" />
            ) : (
              <HiArrowsPointingOut className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Extra Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            title="More Options"
          >
            <HiEllipsisVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── MOBILE OVERFLOW DROPDOWN MENU ──────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden bg-[#240c49] border-b border-white/15 px-4 py-3 z-30 flex flex-wrap items-center justify-between gap-3 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={handleFitWidth}
                className="px-2.5 py-1 rounded-md bg-white/10 text-xs text-white"
              >
                Fit Width
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-2.5 py-1 rounded-md bg-white/10 text-xs text-white flex items-center gap-1"
              >
                <HiArrowsPointingOut className="w-3 h-3" />
                <span>Fullscreen</span>
              </button>
            </div>

            <a
              href={book.fileUrl}
              download={book.fileName}
              className="px-3 py-1 rounded-md bg-[#FDE88C] text-[#1B0A37] font-semibold text-xs flex items-center gap-1"
            >
              <HiArrowDownTray className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN READING CANVAS AREA ─────────────────────────── */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* TOC Sidebar Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute lg:relative z-30 inset-y-0 left-0 w-80 max-w-[85vw] bg-[#1B0A37] border-r border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <HiBookOpen className="w-4 h-4 text-[#FDE88C]" />
                  <span>Contents & Navigation</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              {/* Book Info Card in Sidebar */}
              <div className="p-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs text-[#FDE88C] font-medium mb-1">
                  <HiAcademicCap className="w-4 h-4" />
                  <span>{book.faculty}</span>
                </div>
                <h4 className="text-xs font-semibold text-white line-clamp-2">{book.title}</h4>
                <p className="text-[11px] text-white/60 mt-1">{book.extraMeta}</p>
              </div>

              {/* Outline / Chapter list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                {tocItems.length > 0 ? (
                  tocItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.pageNumber) {
                          goToPage(item.pageNumber)
                          if (window.innerWidth < 1024) setIsSidebarOpen(false)
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <span className="truncate pr-2">{item.title}</span>
                      {item.pageNumber && (
                        <span className="font-mono text-[10px] text-[#FDE88C]/80 group-hover:text-[#FDE88C]">
                          p.{item.pageNumber}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-white/50 space-y-2">
                    <p>No embedded PDF bookmarks found.</p>
                    <p className="text-[11px] text-white/40">
                      Use the page navigator below to jump to any page (1 to {totalPages}).
                    </p>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* PDF Page Canvas Scroll Container */}
        <main
          ref={canvasContainerRef}
          className={`flex-1 overflow-auto flex flex-col items-center justify-start p-3 sm:p-6 pb-20 md:pb-8 transition-colors duration-300 ${currentTheme.containerBg}`}
        >
          {isLoading ? (
            <div className="my-auto flex flex-col items-center gap-4 text-[#1B0A37]">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[#1B0A37]/20 animate-ping" />
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#1B0A37] border-t-[#FDE88C] animate-spin" />
              </div>
              <div className="text-center px-4">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1B0A37]">Opening Academic Textbook</h3>
                <p className="text-xs text-[#1B0A37]/70 mt-1">Preparing high-resolution reader canvas... {loadingProgress}%</p>
              </div>
            </div>
          ) : errorMessage ? (
            <div className="my-auto max-w-md p-6 rounded-2xl bg-white shadow-xl border border-red-200 text-center space-y-4 mx-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <HiXMark className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1B0A37]">Unable to Display PDF</h3>
              <p className="text-xs text-gray-600">{errorMessage}</p>
              <div className="flex justify-center gap-3 pt-2">
                <a
                  href={book.fileUrl}
                  download={book.fileName}
                  className="px-4 py-2 rounded-xl bg-[#1B0A37] text-white text-xs font-semibold hover:bg-[#200441] transition-colors"
                >
                  Download File Directly
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-full flex flex-col items-center my-auto">
              {/* Rendered Canvas with Theme Filters and aspect-ratio preservation */}
              <div
                className="w-full flex justify-center items-center rounded-lg shadow-xl overflow-hidden border border-black/10 transition-all duration-300"
                style={{
                  filter: currentTheme.canvasFilter,
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="block mx-auto max-w-full h-auto object-contain"
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── DOCKED MOBILE BOTTOM ACTION BAR ───────────────────── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#1B0A37]/95 backdrop-blur-md border-t border-white/15 px-3 py-2 z-20 flex items-center justify-between shadow-2xl">
        {/* Page Nav */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
            title="Previous Page"
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              goToPage(parseInt(pageInput) || currentPage)
            }}
            className="flex items-center gap-1 text-xs"
          >
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(String(currentPage))}
              className="w-9 px-1 py-0.5 text-center font-mono rounded bg-white/15 border border-white/20 text-white text-xs"
            />
            <span className="text-white/60 text-[11px]">/ {totalPages || 1}</span>
          </form>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
            title="Next Page"
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Zoom Control */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-white/15 rounded text-white/80"
          >
            <HiMagnifyingGlassMinus className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 text-[11px] font-mono text-[#FDE88C]">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-white/15 rounded text-white/80"
          >
            <HiMagnifyingGlassPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress pill */}
        <div className="text-[11px] font-semibold text-[#FDE88C] bg-[#FDE88C]/15 px-2 py-0.5 rounded-full">
          {readPercent}%
        </div>
      </div>
    </div>
  )
}
