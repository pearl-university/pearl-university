export interface ReadingProgress {
  bookId: string
  page: number
  totalPages: number
  zoom: number
  themeMode: 'light' | 'sepia' | 'dark'
  lastReadAt: number
}

const STORAGE_KEY_PREFIX = 'pearl_reader_progress_'
const RECENT_LIST_KEY = 'pearl_reader_recent_list'
const BOOKMARKS_LIST_KEY = 'pearl_reader_bookmarks'

export function getReadingProgress(bookId: string): ReadingProgress | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${bookId}`)
    if (!raw) return null
    return JSON.parse(raw) as ReadingProgress
  } catch {
    return null
  }
}

export function saveReadingProgress(
  bookId: string,
  progress: Omit<ReadingProgress, 'bookId' | 'lastReadAt'>
): void {
  if (typeof window === 'undefined') return
  try {
    const data: ReadingProgress = {
      ...progress,
      bookId,
      lastReadAt: Date.now(),
    }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${bookId}`, JSON.stringify(data))

    // Update recent read list
    const recentRaw = localStorage.getItem(RECENT_LIST_KEY)
    let recentList: string[] = recentRaw ? JSON.parse(recentRaw) : []
    recentList = [bookId, ...recentList.filter((id) => id !== bookId)].slice(0, 30)
    localStorage.setItem(RECENT_LIST_KEY, JSON.stringify(recentList))
  } catch {
    // Ignore localStorage quota errors silently
  }
}

export function getRecentBookIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RECENT_LIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const INITIAL_DEMO_BOOKMARKS = ['book-1', 'book-6', 'book-12']

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(BOOKMARKS_LIST_KEY)
    if (raw === null) {
      // First-time visitor: seed default curated academic textbooks
      localStorage.setItem(BOOKMARKS_LIST_KEY, JSON.stringify(INITIAL_DEMO_BOOKMARKS))
      return INITIAL_DEMO_BOOKMARKS
    }
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function isBookmarked(bookId: string): boolean {
  return getBookmarks().includes(bookId)
}

export function toggleBookmark(bookId: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const bookmarks = getBookmarks()
    let updated: string[]
    let isAdded = false
    if (bookmarks.includes(bookId)) {
      updated = bookmarks.filter((id) => id !== bookId)
      isAdded = false
    } else {
      updated = [bookId, ...bookmarks]
      isAdded = true
    }
    localStorage.setItem(BOOKMARKS_LIST_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('pearl_bookmarks_changed'))
    return isAdded
  } catch {
    return false
  }
}

export function clearReadingHistory(): void {
  if (typeof window === 'undefined') return
  try {
    const recents = getRecentBookIds()
    recents.forEach((id) => {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`)
    })
    localStorage.setItem(RECENT_LIST_KEY, JSON.stringify([]))
    window.dispatchEvent(new CustomEvent('pearl_reading_history_changed'))
  } catch {}
}

export function clearBookmarks(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BOOKMARKS_LIST_KEY, JSON.stringify([]))
    window.dispatchEvent(new CustomEvent('pearl_bookmarks_changed'))
  } catch {}
}

// Cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === BOOKMARKS_LIST_KEY) {
      window.dispatchEvent(new CustomEvent('pearl_bookmarks_changed'))
    }
    if (e.key === RECENT_LIST_KEY || e.key?.startsWith(STORAGE_KEY_PREFIX)) {
      window.dispatchEvent(new CustomEvent('pearl_reading_history_changed'))
    }
  })
}


