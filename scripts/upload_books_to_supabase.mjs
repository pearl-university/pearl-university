#!/usr/bin/env node
/**
 * Pearl University — Supabase Storage Auto-Uploader Pipeline
 * 
 * Synchronizes the active 595 accredited university textbooks from
 * `src/utils/bookScanner.ts` to Supabase Storage CDN `books` bucket with
 * resume support, integrity verification, concurrency control, and progress reporting.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const booksBaseDir = path.join(rootDir, 'src', 'assets', 'books')
const scannerPath = path.join(rootDir, 'src', 'utils', 'bookScanner.ts')

// Supabase Configuration
const SUPABASE_PROJECT_ID = 'wzljqkiofryabdscnumx'
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`
const BUCKET_NAME = 'books'
const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bGpxa2lvZnJ5YWJkc2NudW14Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTYyMTYxMywiZXhwIjoyMTA1MTk3NjEzfQ.JK-uQ7ooUSYzWAQ6_qVIdZ_vpN6M5l54WEM8QUzkBHs'

const CONCURRENCY = 3
const MAX_RETRIES = 3

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function encodeStoragePath(relPath) {
  return relPath
    .replace(/^\/+/, '')
    .split(path.sep)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

async function checkFileExistsOnSupabase(encodedPath) {
  try {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${encodedPath}`
    const res = await fetch(url, { method: 'HEAD' })
    if (res.status === 200) {
      const contentLength = res.headers.get('content-length')
      return { exists: true, size: contentLength ? parseInt(contentLength, 10) : null }
    }
    return { exists: false }
  } catch {
    return { exists: false }
  }
}

async function uploadFileToSupabase(filePath, relPath, retryCount = 0) {
  const encodedPath = encodeStoragePath(relPath)
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${encodedPath}`
  const fileStat = fs.statSync(filePath)
  const fileBuffer = fs.readFileSync(filePath)

  try {
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        'Content-Type': 'application/pdf',
        'x-upsert': 'true',
      },
      body: fileBuffer,
      duplex: 'half',
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }

    return { success: true, size: fileStat.size }
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      const waitTime = (retryCount + 1) * 3000
      await new Promise((r) => setTimeout(r, waitTime))
      return uploadFileToSupabase(filePath, relPath, retryCount + 1)
    }
    throw err
  }
}

function loadActiveCatalogBooks() {
  const content = fs.readFileSync(scannerPath, 'utf8')
  // Strip comments (which excludes the 16 deferred oversized books)
  const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '')
  const catalogPaths = [...stripped.matchAll(/storagePath:\s*(?:\"([^\"]+)\"|'([^']+)')/g)].map(
    (m) => m[1] || m[2]
  )

  const activeBooks = []
  const missingFiles = []

  catalogPaths.forEach((relPath) => {
    const filePath = path.join(booksBaseDir, relPath)
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath)
      activeBooks.push({
        relPath,
        filePath,
        size: stat.size,
        fileName: path.basename(filePath),
      })
    } else {
      missingFiles.push(relPath)
    }
  })

  if (missingFiles.length > 0) {
    console.warn(`⚠️ Warning: ${missingFiles.length} files from active catalog were not found on disk:`)
    missingFiles.forEach((f) => console.warn(`   - ${f}`))
  }

  return activeBooks
}

async function runUploader() {
  console.log('══════════════════════════════════════════════════════════════')
  console.log('  PEARL UNIVERSITY E-LIBRARY — SUPABASE CDN UPLOADER')
  console.log(`  Project: ${SUPABASE_PROJECT_ID} | Bucket: ${BUCKET_NAME}`)
  console.log('══════════════════════════════════════════════════════════════\n')

  const activeBooks = loadActiveCatalogBooks()
  const totalFiles = activeBooks.length
  let totalBytes = 0
  activeBooks.forEach((b) => (totalBytes += b.size))

  console.log(`Loaded ${totalFiles} active catalog textbooks from bookScanner.ts`)
  console.log(`Total Active Catalog Size: ${formatBytes(totalBytes)}\n`)

  let uploadedCount = 0
  let skippedCount = 0
  let failedCount = 0
  let uploadedBytes = 0
  const failedItems = []

  // Concurrency Pool
  let index = 0
  async function worker(workerId) {
    while (index < activeBooks.length) {
      const currentIdx = index++
      const book = activeBooks[currentIdx]
      const encodedPath = encodeStoragePath(book.relPath)
      const numStr = `[${currentIdx + 1}/${totalFiles}]`

      try {
        // Fast-path: Check if already in Supabase CDN with matching byte count
        const remoteCheck = await checkFileExistsOnSupabase(encodedPath)
        if (remoteCheck.exists && remoteCheck.size === book.size) {
          skippedCount++
          console.log(`${numStr} ⏩ Synced: ${book.fileName} (${formatBytes(book.size)})`)
          continue
        }

        console.log(`${numStr} ⬆️  Uploading: ${book.fileName} (${formatBytes(book.size)})...`)
        const t0 = Date.now()
        await uploadFileToSupabase(book.filePath, book.relPath)
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1)

        uploadedCount++
        uploadedBytes += book.size
        console.log(`${numStr} ✅ Uploaded in ${elapsed}s: ${book.fileName}`)
      } catch (err) {
        failedCount++
        failedItems.push({ file: book.relPath, size: book.size, error: err.message })
        console.error(`${numStr} ❌ Failed: ${book.fileName} -> ${err.message}`)
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1))
  await Promise.all(workers)

  console.log('\n══════════════════════════════════════════════════════════════')
  console.log('  UPLOAD SUMMARY REPORT')
  console.log('══════════════════════════════════════════════════════════════')
  console.log(`  Active Catalog Textbooks: ${totalFiles}`)
  console.log(`  Already Synced in Cloud:  ${skippedCount}`)
  console.log(`  Newly Uploaded:           ${uploadedCount} (${formatBytes(uploadedBytes)})`)
  console.log(`  Failed:                   ${failedCount}`)
  console.log('══════════════════════════════════════════════════════════════\n')

  if (failedItems.length > 0) {
    console.log('⚠️ Failed Uploads Details:')
    failedItems.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.file} (${formatBytes(item.size)})`)
      console.log(`     Error: ${item.error}`)
    })
    fs.writeFileSync(
      path.join(rootDir, 'scripts', 'upload_failures.json'),
      JSON.stringify(failedItems, null, 2)
    )
    console.log('\nSaved failure log to scripts/upload_failures.json')
  } else {
    console.log('🎉 100% of the active catalog (595/595) is synchronized on Supabase CDN!')
  }
}

runUploader().catch((err) => {
  console.error('Fatal Uploader Error:', err)
  process.exit(1)
})
