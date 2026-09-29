#!/usr/bin/env node
/**
 * Pearl University — Dynamic E-Library Auto-Sync & Deduplication Pipeline
 * 
 * Automatically detects any raw folder dropped into `src/assets/books/`, cleans
 * up Calibre/Z-Lib noise, maps books intelligently to the University's 3 faculties
 * & departments, guarantees STRICT ZERO-DUPLICATES, and regenerates `src/utils/bookScanner.ts`.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const booksBaseDir = path.join(rootDir, 'src', 'assets', 'books')

const KNOWN_FACULTY_FOLDERS = [
  'faculty of allied and health sciences',
  'faculty of management and social sciences',
  'faculty of computing',
]

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

function cleanFilename(rawName) {
  return rawName
    .replace(/\.pdf$/i, '')
    .replace(/\s*\(z-lib\.org\)/gi, '')
    .replace(/\s*\(z-library\.sk[^\)]*\)/gi, '')
    .replace(/\s*\[genuine pdf\]/gi, '')
    .replace(/\s*\(Rough Cut\)/gi, '')
    .replace(/\s*\(1\)$/gi, '')
    .replace(/[_\s]+/g, ' ')
    .trim()
}

function normalizeTitleKey(str) {
  return str
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9]/g, '')
}

function extractMetadataFromPath(relPath) {
  const fileName = path.basename(relPath)
  let cleanName = cleanFilename(fileName)
  let publishedYear = '2023'
  let author = 'Academic Faculty & Research Council'

  // Extract year prefix if available
  const yearMatch = cleanName.match(/^(\d{4})[\s_\-–]+/)
  if (yearMatch) {
    publishedYear = yearMatch[1]
    cleanName = cleanName.replace(/^(\d{4})[\s_\-–]+/, '')
  }

  // Extract author if in parenthesis at end
  const authorMatch = cleanName.match(/\(([^)]+)\)$/)
  if (authorMatch) {
    author = authorMatch[1].trim()
    cleanName = cleanName.replace(/\(([^)]+)\)$/, '').trim()
  } else if (cleanName.includes(' - ')) {
    const parts = cleanName.split(' - ')
    if (parts.length >= 2) {
      author = parts[parts.length - 1].trim()
      cleanName = parts.slice(0, -1).join(' ').trim()
    }
  }

  let title = cleanName.trim()
  const lowerRel = relPath.toLowerCase()
  const lowerTitle = title.toLowerCase()

  let faculty = 'Faculty of Computing'
  let department = 'Computer Science'
  let coreArea = 'Computer Science'
  let coverFallbackUrl = 'https://images.unsplash.com/photo-1516116211227-bbc141872147?w=400&auto=format&fit=crop&q=80'

  // Specific Journal / Academic overrides
  if (lowerTitle.includes('biomedical and health informatics') || lowerTitle.includes('biomedical_and_health')) {
    title = 'IEEE Journal of Biomedical and Health Informatics'
    author = 'IEEE Engineering in Medicine and Biology Society'
    faculty = 'Faculty of Allied and Health Sciences'
    department = 'Health Information Management'
    coreArea = 'Health Informatics Research'
    publishedYear = '2024'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80'
  } else if (lowerTitle.includes('internet of things journal')) {
    title = 'IEEE Internet of Things Journal'
    author = 'IEEE Computer Society'
    faculty = 'Faculty of Computing'
    department = 'Computer Science'
    coreArea = 'IoT & Distributed Systems'
    publishedYear = '2024'
  } else if (lowerTitle.includes('tmc-3374815') || lowerTitle.includes('mobile computing')) {
    title = 'IEEE Transactions on Mobile Computing'
    author = 'IEEE Computer Society'
    faculty = 'Faculty of Computing'
    department = 'Cyber Security'
    coreArea = 'Wireless & Mobile Security'
    publishedYear = '2024'
  }
  // 1. ALLIED & HEALTH SCIENCES
  else if (
    lowerRel.includes('health') ||
    lowerRel.includes('medicine') ||
    lowerRel.includes('hospital') ||
    lowerTitle.includes('health') ||
    lowerTitle.includes('medicine') ||
    lowerTitle.includes('primary care') ||
    lowerTitle.includes('hospital')
  ) {
    faculty = 'Faculty of Allied and Health Sciences'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80'

    if (lowerTitle.includes('hospital') || lowerTitle.includes('administration')) {
      department = 'Health Care Administration and Hospital Management'
      coreArea = 'Hospital Administration'
    } else if (lowerTitle.includes('informatics') || lowerTitle.includes('information') || lowerTitle.includes('data') || lowerTitle.includes('iot')) {
      department = 'Health Information Management'
      coreArea = 'Health Systems & Informatics'
    } else {
      department = 'Public Health'
      coreArea = 'Community & Primary Health'
    }
  }
  // 2. MANAGEMENT & SOCIAL SCIENCES
  else if (
    lowerRel.includes('accounting') ||
    lowerRel.includes('finance') ||
    lowerRel.includes('tax') ||
    lowerRel.includes('economics') ||
    lowerRel.includes('criminology') ||
    lowerRel.includes('crime') ||
    lowerRel.includes('security and conflict') ||
    lowerRel.includes('business') ||
    lowerRel.includes('operation research') ||
    lowerTitle.includes('accounting') ||
    lowerTitle.includes('finance') ||
    lowerTitle.includes('taxation') ||
    lowerTitle.includes('economic') ||
    lowerTitle.includes('criminology') ||
    lowerTitle.includes('forensic accounting') ||
    lowerTitle.includes('business communication') ||
    lowerTitle.includes('operations research')
  ) {
    faculty = 'Faculty of Management & Social Sciences'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80'

    if (lowerTitle.includes('tax') || lowerTitle.includes('accounting') || lowerTitle.includes('cost')) {
      department = 'Accounting and Finance'
      coreArea = 'Financial & Forensic Accounting'
    } else if (lowerTitle.includes('crime') || lowerTitle.includes('forensic science') || lowerTitle.includes('conflict') || lowerTitle.includes('terrorism') || lowerTitle.includes('sea')) {
      department = 'Criminology, Security and Conflict Studies'
      coreArea = 'Conflict & Criminological Studies'
    } else if (lowerTitle.includes('business') || lowerTitle.includes('communication') || lowerTitle.includes('management')) {
      department = 'Business Administration'
      coreArea = 'Corporate Management & Communication'
    } else {
      department = 'Economics'
      coreArea = 'Economics & Operations Research'
    }
  }
  // 3. COMPUTING
  else {
    faculty = 'Faculty of Computing'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1516116211227-bbc141872147?w=400&auto=format&fit=crop&q=80'

    if (lowerRel.includes('cyber') || lowerTitle.includes('cryptography') || lowerTitle.includes('security') || lowerTitle.includes('hacking') || lowerTitle.includes('forensics') || lowerTitle.includes('zabbix') || lowerTitle.includes('monitoring')) {
      department = 'Cyber Security'
      coreArea = 'Cyber Security & Forensics'
    } else if (
      lowerRel.includes('data science') ||
      lowerRel.includes('numerical') ||
      lowerRel.includes('matlab') ||
      lowerTitle.includes('data analysis') ||
      lowerTitle.includes('machine learning') ||
      lowerTitle.includes('deep learning') ||
      lowerTitle.includes('numerical')
    ) {
      department = 'Data Science'
      coreArea = 'Data Science & Machine Learning'
    } else if (
      lowerRel.includes('software') ||
      lowerRel.includes('react') ||
      lowerRel.includes('vue') ||
      lowerRel.includes('node') ||
      lowerRel.includes('javascript') ||
      lowerRel.includes('java') ||
      lowerRel.includes('python') ||
      lowerRel.includes('c#') ||
      lowerRel.includes('c++') ||
      lowerRel.includes('ruby') ||
      lowerTitle.includes('software') ||
      lowerTitle.includes('development') ||
      lowerTitle.includes('programming') ||
      lowerTitle.includes('effective java') ||
      lowerTitle.includes('head first') ||
      lowerTitle.includes('cookbook') ||
      lowerTitle.includes('all in one') ||
      lowerTitle.includes('dummies') ||
      lowerTitle.includes('fullstack')
    ) {
      department = 'Software Engineering'
      coreArea = 'Software Systems & Engineering'
    } else if (lowerRel.includes('compiler') || lowerTitle.includes('compiler')) {
      department = 'Computer Science'
      coreArea = 'Compiler Design & Theory'
    } else if (lowerRel.includes('algorithm') || lowerTitle.includes('algorithm') || lowerTitle.includes('data structures')) {
      department = 'Computer Science'
      coreArea = 'Data Structures & Algorithms'
    } else if (lowerRel.includes('database') || lowerTitle.includes('database')) {
      department = 'Computer Science'
      coreArea = 'Database Design & Management'
    } else if (lowerRel.includes('network') || lowerTitle.includes('network') || lowerTitle.includes('communication')) {
      department = 'Computer Science'
      coreArea = 'Computer Networks & Telecommunications'
    } else {
      department = 'Computer Science'
      coreArea = 'Foundations of Computing'
    }
  }

  const cleanFileName = `${title}.pdf`.replace(/[/\\?%*:|"<>]/g, '-')
  const targetRelPath = path.join(faculty.toLowerCase(), department, coreArea, cleanFileName)

  return {
    faculty,
    department,
    coreArea,
    title,
    author,
    extraMeta: `University Textbook Edition • Published ${publishedYear}`,
    publishedYear,
    coverFallbackUrl,
    fileName: cleanFileName,
    targetRelPath,
  }
}

export async function syncLibraryBooks() {
  console.log('🔄 Checking for incoming book folders in src/assets/books/...')

  // Step 1: Detect incoming folders
  const items = fs.readdirSync(booksBaseDir)
  const incomingDirs = items.filter((item) => {
    const fullPath = path.join(booksBaseDir, item)
    if (!fs.statSync(fullPath).isDirectory()) return false
    return !KNOWN_FACULTY_FOLDERS.includes(item.toLowerCase())
  })

  // Build current known file index by (size) and (normalized title)
  const existingFiles = walk(booksBaseDir).filter((f) => {
    const isUnderKnown = KNOWN_FACULTY_FOLDERS.some((k) => f.toLowerCase().includes(k))
    return isUnderKnown && f.endsWith('.pdf')
  })

  const knownSizeMap = new Map() // size -> fullPath
  const knownTitleMap = new Map() // normTitle -> fullPath

  for (const f of existingFiles) {
    const size = fs.statSync(f).size
    const norm = normalizeTitleKey(path.basename(f))
    knownSizeMap.set(size, f)
    knownTitleMap.set(norm, f)
  }

  // Step 2: Ingest incoming directories with strict deduplication
  if (incomingDirs.length > 0) {
    console.log(`Found ${incomingDirs.length} incoming directory/directories:`, incomingDirs)

    for (const inDir of incomingDirs) {
      const fullInDir = path.join(booksBaseDir, inDir)
      const pdfs = walk(fullInDir).filter((f) => f.endsWith('.pdf'))
      console.log(`Processing ${pdfs.length} PDFs from ${inDir}...`)

      let addedCount = 0
      let skippedDuplicates = 0

      for (const pdfPath of pdfs) {
        const size = fs.statSync(pdfPath).size
        const norm = normalizeTitleKey(path.basename(pdfPath))

        // Check if duplicate of an existing book
        if (knownSizeMap.has(size) || knownTitleMap.has(norm)) {
          skippedDuplicates++
          fs.unlinkSync(pdfPath)
          continue
        }

        const rel = path.relative(fullInDir, pdfPath)
        const meta = extractMetadataFromPath(rel)
        const destPath = path.join(booksBaseDir, meta.targetRelPath)

        fs.mkdirSync(path.dirname(destPath), { recursive: true })

        if (!fs.existsSync(destPath)) {
          fs.renameSync(pdfPath, destPath)
          knownSizeMap.set(size, destPath)
          knownTitleMap.set(norm, destPath)
          addedCount++
        } else {
          fs.unlinkSync(pdfPath)
          skippedDuplicates++
        }
      }

      // Purge incoming folder
      fs.rmSync(fullInDir, { recursive: true, force: true })
      console.log(`✓ Ingested ${addedCount} new books (Skipped ${skippedDuplicates} duplicates). Cleaned up: ${inDir}`)
    }
  }

  // Step 3: Global Deduplication Pass across all faculty directories (ensures strictly 1 copy of each book)
  const allCurrentPdfs = walk(booksBaseDir).filter((f) => f.endsWith('.pdf'))
  const seenSizes = new Map()
  const seenTitles = new Map()
  let removedExistingDuplicates = 0

  for (const pdfPath of allCurrentPdfs) {
    if (!fs.existsSync(pdfPath)) continue
    const size = fs.statSync(pdfPath).size
    const norm = normalizeTitleKey(path.basename(pdfPath))

    if (seenSizes.has(size) || seenTitles.has(norm)) {
      fs.unlinkSync(pdfPath)
      removedExistingDuplicates++
      continue
    }

    seenSizes.set(size, pdfPath)
    seenTitles.set(norm, pdfPath)
  }

  if (removedExistingDuplicates > 0) {
    console.log(`✓ Removed ${removedExistingDuplicates} duplicate book occurrences across departments.`)
  }

  // Step 4: Clean up any empty folders or non-PDF artifacts
  const allFiles = walk(booksBaseDir)
  let purgedNoise = 0
  for (const f of allFiles) {
    if (!f.endsWith('.pdf') && !f.endsWith('.DS_Store')) {
      fs.unlinkSync(f)
      purgedNoise++
    }
  }
  if (purgedNoise > 0) {
    console.log(`✓ Purged ${purgedNoise} non-PDF metadata/artifact files.`)
  }

  // Step 5: Re-scan complete unified catalog
  const unifiedPdfs = walk(booksBaseDir).filter((f) => f.endsWith('.pdf'))
  console.log(`\n📚 Total Unique Academic Textbooks in Catalog: ${unifiedPdfs.length}`)

  const catalogEntries = unifiedPdfs.map((fullPdfPath) => {
    const rel = path.relative(booksBaseDir, fullPdfPath)
    const segments = rel.split(path.sep)

    let facultyRaw = segments[0] || 'faculty of computing'
    let faculty = 'Faculty of Computing'
    if (facultyRaw.includes('allied')) {
      faculty = 'Faculty of Allied and Health Sciences'
    } else if (facultyRaw.includes('management')) {
      faculty = 'Faculty of Management & Social Sciences'
    } else {
      faculty = 'Faculty of Computing'
    }

    const department = segments[1] || 'Computer Science'
    const coreArea = segments[2] || 'Core Subject'
    const fileName = segments[segments.length - 1]
    const title = path.basename(fileName, '.pdf')

    let coverFallbackUrl = 'https://images.unsplash.com/photo-1516116211227-bbc141872147?w=400&auto=format&fit=crop&q=80'
    if (faculty === 'Faculty of Allied and Health Sciences') {
      coverFallbackUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80'
    } else if (faculty === 'Faculty of Management & Social Sciences') {
      coverFallbackUrl = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80'
    }

    return {
      faculty,
      department,
      coreArea,
      fileName,
      storagePath: rel,
      title,
      author: 'Academic Faculty & Research Council',
      extraMeta: 'University Core Curriculum Edition',
      publishedYear: '2023',
      coverFallbackUrl,
    }
  })

  catalogEntries.sort((a, b) => {
    if (a.faculty !== b.faculty) return a.faculty.localeCompare(b.faculty)
    if (a.department !== b.department) return a.department.localeCompare(b.department)
    if (a.coreArea !== b.coreArea) return a.coreArea.localeCompare(b.coreArea)
    return a.title.localeCompare(b.title)
  })

  const catalogEntriesTs = catalogEntries.map((entry) => {
    return `  {
    faculty: ${JSON.stringify(entry.faculty)},
    department: ${JSON.stringify(entry.department)},
    coreArea: ${JSON.stringify(entry.coreArea)},
    fileName: ${JSON.stringify(entry.fileName)},
    storagePath: ${JSON.stringify(entry.storagePath)},
    title: ${JSON.stringify(entry.title)},
    author: ${JSON.stringify(entry.author)},
    extraMeta: ${JSON.stringify(entry.extraMeta)},
    publishedYear: ${JSON.stringify(entry.publishedYear)},
    coverFallbackUrl: ${JSON.stringify(entry.coverFallbackUrl)},
  },`
  }).join('\n')

  const scannerTsPath = path.join(rootDir, 'src', 'utils', 'bookScanner.ts')
  const bookScannerContent = `// Dynamic Book Library Catalog & Scanner
// Connects Pearl University e-Library to Supabase Storage CDN
// Storage Key Hierarchy: faculties -> courses/departments -> core academic area -> book file

import { getSupabaseBookUrl } from '../config/supabaseConfig'

export interface BookMetadata {
  id: string
  title: string
  author: string
  extraMeta: string // volume, edition, publication, chapter info
  faculty: string
  department: string
  coreArea: string
  fileName: string
  fileUrl: string
  fileExtension: string
  coverUrl: string
  publishedYear?: string
  storagePath: string
}

export interface BookEntryDefinition {
  faculty: string
  department: string
  coreArea: string
  fileName: string
  storagePath: string
  title: string
  author: string
  extraMeta: string
  publishedYear?: string
  coverFallbackUrl: string
}

// Full Academic Textbook Catalog with exact bucket storage paths
export const OFFICIAL_BOOK_CATALOG: BookEntryDefinition[] = [
${catalogEntriesTs}
]

// Build unified library catalog
function buildLibraryCatalog(): BookMetadata[] {
  return OFFICIAL_BOOK_CATALOG.map((item) => {
    const fileUrl = getSupabaseBookUrl(item.storagePath)

    const dotIndex = item.fileName.lastIndexOf('.')
    const ext = dotIndex !== -1 ? item.fileName.slice(dotIndex + 1).toLowerCase() : 'pdf'
    const id = \`\${item.faculty}-\${item.department}-\${item.coreArea}-\${item.title}\`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')

    return {
      id,
      title: item.title,
      author: item.author,
      extraMeta: item.extraMeta,
      faculty: item.faculty,
      department: item.department,
      coreArea: item.coreArea,
      fileName: item.fileName,
      fileUrl,
      fileExtension: ext,
      coverUrl: item.coverFallbackUrl,
      publishedYear: item.publishedYear,
      storagePath: item.storagePath,
    }
  })
}

// In-memory catalog of parsed books
export const LOCAL_BOOKS_LIBRARY: BookMetadata[] = buildLibraryCatalog()

// Dynamic Query Helpers for UI filtering
export function getUniqueFaculties(): string[] {
  const set = new Set<string>()
  LOCAL_BOOKS_LIBRARY.forEach((b) => set.add(b.faculty))
  return Array.from(set).sort()
}

export function getUniqueDepartments(facultyFilter?: string): string[] {
  const set = new Set<string>()
  LOCAL_BOOKS_LIBRARY.forEach((b) => {
    if (!facultyFilter || facultyFilter === 'All Faculties' || facultyFilter === 'Faculty' || b.faculty === facultyFilter) {
      set.add(b.department)
    }
  })
  return Array.from(set).sort()
}

export function getUniqueCoreAreas(facultyFilter?: string, deptFilter?: string): string[] {
  const set = new Set<string>()
  LOCAL_BOOKS_LIBRARY.forEach((b) => {
    const matchFaculty =
      !facultyFilter || facultyFilter === 'All Faculties' || facultyFilter === 'Faculty' || b.faculty === facultyFilter
    const matchDept =
      !deptFilter || deptFilter === 'All Departments' || deptFilter === 'Department' || b.department === deptFilter
    if (matchFaculty && matchDept) {
      set.add(b.coreArea)
    }
  })
  return Array.from(set).sort()
}

export function filterBooks(options: {
  faculty?: string
  department?: string
  coreArea?: string
  searchQuery?: string
}): BookMetadata[] {
  return LOCAL_BOOKS_LIBRARY.filter((book) => {
    if (
      options.faculty &&
      options.faculty !== 'All Faculties' &&
      options.faculty !== 'Faculty' &&
      book.faculty.toLowerCase() !== options.faculty.toLowerCase()
    ) {
      return false
    }

    if (
      options.department &&
      options.department !== 'All Departments' &&
      options.department !== 'Department' &&
      book.department.toLowerCase() !== options.department.toLowerCase()
    ) {
      return false
    }

    if (
      options.coreArea &&
      options.coreArea !== 'All Areas' &&
      book.coreArea.toLowerCase() !== options.coreArea.toLowerCase()
    ) {
      return false
    }

    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim()
      const matchTitle = book.title.toLowerCase().includes(q)
      const matchAuthor = book.author.toLowerCase().includes(q)
      const matchCore = book.coreArea.toLowerCase().includes(q)
      const matchMeta = book.extraMeta.toLowerCase().includes(q)
      if (!matchTitle && !matchAuthor && !matchCore && !matchMeta) {
        return false
      }
    }

    return true
  })
}
`

  fs.writeFileSync(scannerTsPath, bookScannerContent, 'utf8')
  console.log('✓ Successfully updated src/utils/bookScanner.ts with zero duplicates!')
}

syncLibraryBooks().catch((err) => {
  console.error('Error during sync:', err)
  process.exit(1)
})
