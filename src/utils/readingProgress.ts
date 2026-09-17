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
    recentList = [bookId, ...recentList.filter((id) => id !== bookId)].slice(0, 10)
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
