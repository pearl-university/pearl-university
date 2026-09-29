#!/usr/bin/env node
/**
 * Pearl University — Supabase Storage Auto-Uploader Pipeline
 * 
 * Scans all textbooks in `src/assets/books/` and uploads them to the
 * Supabase Storage CDN `books` bucket with concurrency control, resume
 * support, retry logic, and real-time progress reporting.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const booksBaseDir = path.join(rootDir, 'src', 'assets', 'books')

// Supabase Configuration
const SUPABASE_PROJECT_ID = 'wzljqkiofryabdscnumx'
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`
const BUCKET_NAME = 'books'
const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bGpxa2lvZnJ5YWJkc2NudW14Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTYyMTYxMywiZXhwIjoyMTA1MTk3NjEzfQ.JK-uQ7ooUSYzWAQ6_qVIdZ_vpN6M5l54WEM8QUzkBHs'

const CONCURRENCY = 4
const MAX_RETRIES = 3

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function walk(dir) {
  let results = []
  if (!fs.existsSync(dir)) return results
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath))
    } else {
      results.push(fullPath)
    }
  })
  return results
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
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }

    return { success: true, size: fileStat.size }
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      const waitTime = (retryCount + 1) * 2000
      await new Promise((r) => setTimeout(r, waitTime))
      return uploadFileToSupabase(filePath, relPath, retryCount + 1)
    }
    throw err
  }
}

async function runUploader() {
  console.log('══════════════════════════════════════════════════════════════')
  console.log('  PEARL UNIVERSITY E-LIBRARY — SUPABASE CDN UPLOADER')
  console.log(`  Project: ${SUPABASE_PROJECT_ID} | Bucket: ${BUCKET_NAME}`)
  console.log('══════════════════════════════════════════════════════════════\n')

  const allPdfs = walk(booksBaseDir).filter((f) => f.endsWith('.pdf'))
  const totalFiles = allPdfs.length
  let totalBytes = 0
  allPdfs.forEach((f) => (totalBytes += fs.statSync(f).size))

  console.log(`Found ${totalFiles} textbooks to check/upload (Total Size: ${formatBytes(totalBytes)})\n`)

  let uploadedCount = 0
  let skippedCount = 0
  let failedCount = 0
  let uploadedBytes = 0
  const failedItems = []

  // Concurrency Pool
  let index = 0
  async function worker(workerId) {
    while (index < allPdfs.length) {
      const currentIdx = index++
      const pdfPath = allPdfs[currentIdx]
      const relPath = path.relative(booksBaseDir, pdfPath)
      const encodedPath = encodeStoragePath(relPath)
      const fileSize = fs.statSync(pdfPath).size
      const fileName = path.basename(pdfPath)

      const numStr = `[${currentIdx + 1}/${totalFiles}]`

      try {
        // Check if already on Supabase
        const remoteCheck = await checkFileExistsOnSupabase(encodedPath)
        if (remoteCheck.exists && remoteCheck.size === fileSize) {
          skippedCount++
          console.log(`${numStr} ⏩ Already uploaded: ${fileName} (${formatBytes(fileSize)})`)
          continue
        }

        console.log(`${numStr} ⬆️  Uploading: ${fileName} (${formatBytes(fileSize)})...`)
        const t0 = Date.now()
        await uploadFileToSupabase(pdfPath, relPath)
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1)

        uploadedCount++
        uploadedBytes += fileSize
        console.log(`${numStr} ✅ Uploaded in ${elapsed}s: ${fileName}`)
      } catch (err) {
        failedCount++
        failedItems.push({ file: relPath, error: err.message })
        console.error(`${numStr} ❌ Failed: ${fileName} -> ${err.message}`)
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1))
  await Promise.all(workers)

  console.log('\n══════════════════════════════════════════════════════════════')
  console.log('  UPLOAD SUMMARY REPORT')
  console.log('══════════════════════════════════════════════════════════════')
  console.log(`  Total Books Processed:    ${totalFiles}`)
  console.log(`  Newly Uploaded:           ${uploadedCount} (${formatBytes(uploadedBytes)})`)
  console.log(`  Already in Cloud (Skipped):${skippedCount}`)
  console.log(`  Failed:                   ${failedCount}`)
  console.log('══════════════════════════════════════════════════════════════\n')

  if (failedItems.length > 0) {
    console.log('⚠️ Failed Uploads Details:')
    failedItems.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.file}`)
      console.log(`     Error: ${item.error}`)
    })
    fs.writeFileSync(
      path.join(rootDir, 'scripts', 'upload_failures.json'),
      JSON.stringify(failedItems, null, 2)
    )
    console.log('\nSaved failure log to scripts/upload_failures.json')
  } else {
    console.log('🎉 All 100% of books are live in Supabase Storage CDN!')
  }
}

runUploader().catch((err) => {
  console.error('Fatal Uploader Error:', err)
  process.exit(1)
})
