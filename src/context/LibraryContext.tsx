/* eslint-disable react-refresh/only-export-components */
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import {
  type BookMetadata,
  LOCAL_BOOKS_LIBRARY,
  getBookById,
} from '../utils/bookScanner'
import {
  getReadingProgress as storageGetReadingProgress,
  getBookmarks,
  toggleBookmark as storageToggleBookmark,
  clearBookmarks as storageClearBookmarks,
  clearReadingHistory as storageClearReadingHistory,
  type ReadingProgress,
} from '../utils/readingProgress'
import { useUI } from './UIContext'

export interface ReadingItem {
  book: BookMetadata
  progress: ReadingProgress
}

export interface LibraryContextType {
  // Reader Modal State
  activeReadingBook: BookMetadata | null
  openReader: (book: BookMetadata) => void
  closeReader: () => void

  // Bookmarks / Saved Bookshelf
  bookmarks: string[]
  savedBooks: BookMetadata[]
  savedCount: number
  isBookmarked: (bookId: string) => boolean
  toggleBookmark: (book: BookMetadata) => boolean
  clearBookmarks: () => void

  // Reading History & Progress
  readingHistory: ReadingItem[]
  getReadingProgress: (bookId: string) => ReadingProgress | null
  clearReadingHistory: () => void
  refreshLibraryState: () => void
}

const LibraryContext = createContext<LibraryContextType | null>(null)

export const LibraryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { alert } = useUI()

  // 1. Reader Modal State
  const [activeReadingBook, setActiveReadingBook] = useState<BookMetadata | null>(null)

  const openReader = useCallback((book: BookMetadata) => {
    setActiveReadingBook(book)
  }, [])

  const closeReader = useCallback(() => {
    setActiveReadingBook(null)
  }, [])

  // 2. Bookmarks State
  const [bookmarks, setBookmarks] = useState<string[]>(() => getBookmarks())

  // 3. Reading History State
  const [historyTick, setHistoryTick] = useState(0)

  // Listen to window custom & cross-tab storage events
  useEffect(() => {
    const handleBookmarkChange = () => {
      setBookmarks(getBookmarks())
    }
    const handleHistoryChange = () => {
      setHistoryTick((t) => t + 1)
    }

    window.addEventListener('pearl_bookmarks_changed', handleBookmarkChange)
    window.addEventListener('pearl_reading_history_changed', handleHistoryChange)

    return () => {
      window.removeEventListener('pearl_bookmarks_changed', handleBookmarkChange)
      window.removeEventListener('pearl_reading_history_changed', handleHistoryChange)
    }
  }, [])

  // Derived Saved Books (maintaining user bookmark order)
  const savedBooks = useMemo(() => {
    return bookmarks
      .map((id) => getBookById(id))
      .filter((b): b is BookMetadata => Boolean(b))
  }, [bookmarks])

  const savedCount = savedBooks.length

  const isBookmarked = useCallback(
    (bookId: string) => bookmarks.includes(bookId),
    [bookmarks]
  )

  const toggleBookmark = useCallback(
    (book: BookMetadata): boolean => {
      const isAdded = storageToggleBookmark(book.id)
      setBookmarks(getBookmarks())
      if (isAdded) {
        alert.success('Saved to Bookshelf', `"${book.title}" added to your personal bookshelf.`)
      } else {
        alert.info('Removed from Bookshelf', `"${book.title}" removed from your bookshelf.`)
      }
      return isAdded
    },
    [alert]
  )

  const clearBookmarks = useCallback(() => {
    storageClearBookmarks()
    setBookmarks([])
    alert.info('Bookmarks Cleared', 'Your personal bookshelf has been cleared.')
  }, [alert])

  // Reading History (sorted by most recently read)
  const readingHistory = useMemo(() => {
    return LOCAL_BOOKS_LIBRARY
      .map((b) => ({ book: b, progress: storageGetReadingProgress(b.id) }))
      .filter((item): item is ReadingItem => Boolean(item.progress && item.progress.page > 0))
      .sort((a, b) => b.progress.lastReadAt - a.progress.lastReadAt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyTick])

  const getReadingProgress = useCallback((bookId: string) => {
    return storageGetReadingProgress(bookId)
  }, [])

  const clearReadingHistory = useCallback(() => {
    storageClearReadingHistory()
    setHistoryTick((t) => t + 1)
    alert.info('History Cleared', 'All textbook reading progress has been reset.')
  }, [alert])

  const refreshLibraryState = useCallback(() => {
    setBookmarks(getBookmarks())
    setHistoryTick((t) => t + 1)
  }, [])

  return (
    <LibraryContext.Provider
      value={{
        activeReadingBook,
        openReader,
        closeReader,
        bookmarks,
        savedBooks,
        savedCount,
        isBookmarked,
        toggleBookmark,
        clearBookmarks,
        readingHistory,
        getReadingProgress,
        clearReadingHistory,
        refreshLibraryState,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibraryContext = (): LibraryContextType => {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibraryContext must be used within a LibraryProvider')
  }
  return context
}
