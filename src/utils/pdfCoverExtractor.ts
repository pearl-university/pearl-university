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

async function getFromIndexedDB(key: string): Promise<string | null> {
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

async function saveToIndexedDB(key: string, dataUrl: string): Promise<void> {
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

// Simple concurrency queue to avoid freezing UI when 20 covers are loaded concurrently
class ExtractionQueue {
  private queue: Array<() => Promise<void>> = []
  private activeCount = 0
  private maxConcurrency = 2

  public add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result)
        } catch (err) {
          reject(err)
        }
      })
      this.next()
    })
  }

  private next() {
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) {
      return
    }
    const nextTask = this.queue.shift()
    if (nextTask) {
      this.activeCount++
      nextTask().finally(() => {
        this.activeCount--
        this.next()
      })
    }
  }
}

const queue = new ExtractionQueue()

/**
 * Extracts the first page of a PDF and returns a data URL.
 * Automatically checks memory cache and IndexedDB before performing extraction.
 */
export async function extractFirstPageCover(pdfUrl: string, scale = 0.75): Promise<string> {
  if (!pdfUrl) {
    throw new Error('PDF URL is required')
  }

  // 1. Check in-memory cache
  if (memoryCache.has(pdfUrl)) {
    return memoryCache.get(pdfUrl)!
  }

  // 2. Check IndexedDB
  const cachedFromDB = await getFromIndexedDB(pdfUrl)
  if (cachedFromDB) {
    memoryCache.set(pdfUrl, cachedFromDB)
    return cachedFromDB
  }

  // 3. Queue extraction via PDF.js
  return queue.add(async () => {
    // Double check memory cache in case another queued item processed it
    if (memoryCache.has(pdfUrl)) {
      return memoryCache.get(pdfUrl)!
    }

    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      disableFontFace: false,
      cMapPacked: true,
    })

    try {
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1)
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) {
        throw new Error('Could not obtain canvas 2D context')
      }

      canvas.width = viewport.width
      canvas.height = viewport.height

      // Fill background with white in case PDF has transparency
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const renderContext = {
        canvasContext: ctx,
        viewport,
        canvas,
      }

      await page.render(renderContext).promise

      // Convert to compressed WebP or JPEG data URL
      const dataUrl = canvas.toDataURL('image/webp', 0.85)

      // Store in memory & IndexedDB
      memoryCache.set(pdfUrl, dataUrl)
      saveToIndexedDB(pdfUrl, dataUrl)

      // Destroy PDF instance to free up memory
      pdf.destroy()

      return dataUrl
    } catch (err) {
      loadingTask.destroy()
      throw err
    }
  })
}
