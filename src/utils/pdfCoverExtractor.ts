import { pdfjsLib } from './pdfWorkerInit'

// In-memory runtime cache for extracted covers
const memoryCache = new Map<string, string>()

// IndexedDB configuration
const DB_NAME = 'pearl_library_db'
const DB_VERSION = 1
const STORE_NAME = 'pdf_covers'

let dbPromise: Promise<IDBDatabase | null> | null = null

function getDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null)
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onupgradeneeded = () => {
          const db = request.result
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME)
          }
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => resolve(null)
      } catch {
        resolve(null)
      }
    })
  }
  return dbPromise
}

export function getCachedCoverSync(pdfUrl: string): string | null {
  return memoryCache.get(pdfUrl) || null
}

export async function getFromIndexedDB(key: string): Promise<string | null> {
  try {
    const db = await getDB()
    if (!db) return null
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(key)
      req.onsuccess = () => resolve((req.result as string) || null)
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

export async function saveToIndexedDB(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await getDB()
    if (!db) return
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put(dataUrl, key)
  } catch {
    // Ignore cache persistence errors silently
  }
}

interface QueuedTask {
  run: () => Promise<void>
  abort: () => void
  isCancelled: boolean
}

// Low-concurrency worker queue to guarantee main thread 60fps responsiveness
class ExtractionQueue {
  private queue: QueuedTask[] = []
  private activeCount = 0
  private maxConcurrency = 2

  public add<T>(
    taskFactory: (signal: AbortSignal) => Promise<T>,
    externalSignal?: AbortSignal
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const abortController = new AbortController()

      const queuedTask: QueuedTask = {
        isCancelled: false,
        run: async () => {
          if (queuedTask.isCancelled || abortController.signal.aborted) {
            reject(new DOMException('Extraction aborted', 'AbortError'))
            return
          }
          try {
            const result = await taskFactory(abortController.signal)
            resolve(result)
          } catch (err) {
            reject(err)
          }
        },
        abort: () => {
          queuedTask.isCancelled = true
          abortController.abort()
        },
      }

      if (externalSignal) {
        if (externalSignal.aborted) {
          reject(new DOMException('Extraction aborted', 'AbortError'))
          return
        }
        externalSignal.addEventListener('abort', () => {
          queuedTask.abort()
          const index = this.queue.indexOf(queuedTask)
          if (index !== -1) {
            this.queue.splice(index, 1)
          }
          reject(new DOMException('Extraction aborted', 'AbortError'))
        })
      }

      this.queue.push(queuedTask)
      this.next()
    })
  }

  private next() {
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) {
      return
    }
    const nextTask = this.queue.shift()
    if (!nextTask) return

    if (nextTask.isCancelled) {
      this.next()
      return
    }

    this.activeCount++
    nextTask
      .run()
      .catch(() => {})
      .finally(() => {
        this.activeCount--
        this.next()
      })
  }
}

const queue = new ExtractionQueue()

/**
 * Extracts the first page of a PDF and returns a lightweight compressed image URL.
 * Automatically checks memory cache and IndexedDB before performing extraction.
 * Supports AbortSignal and strict timeout protection.
 */
export async function extractFirstPageCover(
  pdfUrl: string,
  scale = 0.55,
  signal?: AbortSignal
): Promise<string> {
  if (!pdfUrl) {
    throw new Error('PDF URL is required')
  }

  // 1. Check in-memory cache (instant 0ms)
  if (memoryCache.has(pdfUrl)) {
    return memoryCache.get(pdfUrl)!
  }

  // 2. Check persistent IndexedDB cache
  const cachedFromDB = await getFromIndexedDB(pdfUrl)
  if (cachedFromDB) {
    memoryCache.set(pdfUrl, cachedFromDB)
    return cachedFromDB
  }

  if (signal?.aborted) {
    throw new DOMException('Extraction aborted', 'AbortError')
  }

  // 3. Queue extraction via PDF.js with timeout and abort support
  return queue.add(async (taskSignal) => {
    // Double check memory cache in case another task loaded it while in queue
    if (memoryCache.has(pdfUrl)) {
      return memoryCache.get(pdfUrl)!
    }

    // Set 3500ms safety timeout to prevent hanging worker on sluggish network
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('PDF extraction timed out after 3500ms'))
      }, 3500)
    })

    const extractionWork = (async () => {
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        disableFontFace: true, // Speeds up first page cover extraction by ~4x
        cMapPacked: true,
        stopAtErrors: false,
      })

      const onAbort = () => {
        try {
          loadingTask.destroy()
        } catch {}
      }

      taskSignal.addEventListener('abort', onAbort)

      try {
        const pdf = await loadingTask.promise
        if (taskSignal.aborted) {
          pdf.destroy()
          throw new DOMException('Extraction aborted', 'AbortError')
        }

        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) {
          throw new Error('Could not obtain canvas 2D context')
        }

        canvas.width = viewport.width
        canvas.height = viewport.height

        // Clean white background
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const renderContext = {
          canvasContext: ctx,
          viewport,
          canvas,
        }

        await page.render(renderContext).promise

        // Convert to compact WebP data URL with 0.8 quality
        const dataUrl = canvas.toDataURL('image/webp', 0.8)

        // Store in memory & IndexedDB
        memoryCache.set(pdfUrl, dataUrl)
        saveToIndexedDB(pdfUrl, dataUrl)

        // Free memory immediately
        pdf.destroy()

        return dataUrl
      } catch (err) {
        try {
          loadingTask.destroy()
        } catch {}
        throw err
      } finally {
        taskSignal.removeEventListener('abort', onAbort)
      }
    })()

    try {
      const result = await Promise.race([extractionWork, timeoutPromise])
      return result
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, signal)
}

