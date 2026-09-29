import fs from 'fs'
import path from 'path'

const baseDir = path.resolve('src/assets/books')
const driveDir = path.join(baseDir, 'drive-download-20260929T103022Z-1-004')

if (!fs.existsSync(driveDir)) {
  console.error('Drive directory not found!')
  process.exit(1)
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

const allDrivePdfs = walk(driveDir).filter((f) => f.endsWith('.pdf'))
console.log(`Found ${allDrivePdfs.length} PDFs in drive download.`)

function cleanBookMetadata(relPath) {
  const fileName = path.basename(relPath, '.pdf')
  const dirParts = path.dirname(relPath).split(path.sep)
  
  let faculty = 'Faculty of Computing'
  let department = 'Computer Science'
  let coreArea = 'Computer Programming'
  let title = fileName
  let author = 'Academic Faculty'
  let extraMeta = 'University Textbook Edition'
  let publishedYear = '2022'
  let coverFallbackUrl = 'https://images.unsplash.com/photo-1516116211227-bbc141872147?w=400&auto=format&fit=crop&q=80'

  // Clean filename noise
  let cleanName = fileName
    .replace(/\s*\(z-lib\.org\)/gi, '')
    .replace(/\s*\(z-library\.sk[^\)]*\)/gi, '')
    .replace(/\s*\[genuine pdf\]/gi, '')
    .replace(/\s*\(Rough Cut\)/gi, '')
    .replace(/\s*\(1\)$/gi, '')
    .trim()

  // Extract year if at start (e.g. "2019_...", "2021-...", "2018_...")
  const yearMatch = cleanName.match(/^(\d{4})[\s_\-–]+/ )
  if (yearMatch) {
    publishedYear = yearMatch[1]
    cleanName = cleanName.replace(/^(\d{4})[\s_\-–]+/, '')
  }

  // Extract author if inside parentheses at end: "Book Title (Author Name)"
  const authorMatch = cleanName.match(/\(([^)]+)\)$/)
  if (authorMatch) {
    author = authorMatch[1].trim()
    cleanName = cleanName.replace(/\(([^)]+)\)$/, '').trim()
  } else if (cleanName.includes('_')) {
    const parts = cleanName.split('_')
    if (parts.length >= 2) {
      author = parts[parts.length - 1].trim()
      cleanName = parts.slice(0, -1).join(' ').trim()
    }
  } else if (cleanName.includes(' - ')) {
    const parts = cleanName.split(' - ')
    if (parts.length >= 2) {
      author = parts[parts.length - 1].trim()
      cleanName = parts.slice(0, -1).join(' ').trim()
    }
  }

  title = cleanName.replace(/[_\s]+/g, ' ').trim()

  // Intelligent Faculty / Department / Core Area classification based on path & title
  const lowerRel = relPath.toLowerCase()
  const lowerTitle = title.toLowerCase()

  // 1. Healthcare / Medical / Health Informatics Matches
  if (lowerRel.includes('healthcare') || lowerTitle.includes('healthcare') || lowerTitle.includes('internet of healthcare')) {
    faculty = 'Faculty of Allied and Health Sciences'
    department = 'Health Information Management'
    coreArea = 'Healthcare IoT & Digital Health'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80'
  }
  // 2. Business / Management / Finance Matches
  else if (lowerRel.includes('business') || lowerTitle.includes('business data communications') || lowerTitle.includes('business users')) {
    faculty = 'Faculty of Management & Social Sciences'
    department = 'Business Administration'
    coreArea = 'Business Communications & Networks'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80'
  }
  // 3. Operations Research / Optimization
  else if (lowerRel.includes('operation research') || lowerTitle.includes('operations research')) {
    faculty = 'Faculty of Management & Social Sciences'
    department = 'Economics'
    coreArea = 'Operations Research & Optimization'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80'
  }
  // 4. Numerical Analysis / Computational Science / MATLAB
  else if (lowerRel.includes('numerical method') || lowerRel.includes('matlab') || lowerTitle.includes('numerical methods') || lowerTitle.includes('numerical analysis') || lowerTitle.includes('engineering mathematics')) {
    faculty = 'Faculty of Computing'
    department = 'Data Science'
    coreArea = 'Numerical Analysis & Scientific Computing'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80'
  }
  // 5. Machine Learning / Data Analysis / Geospatial / Text Mining / Streaming
  else if (
    lowerRel.includes('machine learning') ||
    lowerTitle.includes('machine learning') ||
    lowerTitle.includes('data analysis') ||
    lowerTitle.includes('text mining') ||
    lowerTitle.includes('geospatial') ||
    lowerTitle.includes('data analyst') ||
    lowerTitle.includes('soft computing')
  ) {
    faculty = 'Faculty of Computing'
    department = 'Data Science'
    coreArea = 'Machine Learning & Big Data'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80'
  }
  // 6. Security / Cryptography / Biometrics
  else if (lowerRel.includes('security') || lowerTitle.includes('cryptography') || lowerTitle.includes('biometrics')) {
    faculty = 'Faculty of Computing'
    department = 'Cyber Security'
    coreArea = 'Applied Cryptography & Security'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80'
  }
  // 7. Computer Networks / Data Communications / Routing / Cisco / TCP/IP / Cabling
  else if (lowerRel.includes('network') || lowerRel.includes('data communication') || lowerTitle.includes('tcp/ip') || lowerTitle.includes('cisco') || lowerTitle.includes('cabling')) {
    faculty = 'Faculty of Computing'
    department = 'Computer Science'
    coreArea = 'Computer Networks & Telecommunications'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80'
  }
  // 8. Database Systems / MySQL / PHP Database
  else if (lowerRel.includes('database') || lowerTitle.includes('database') || lowerTitle.includes('mysql')) {
    faculty = 'Faculty of Computing'
    department = 'Computer Science'
    coreArea = 'Database Design & Management'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&auto=format&fit=crop&q=80'
  }
  // 9. Web Development / Full-Stack / React / Node.js / MERN / Electron / Microservices / Flask
  else if (
    lowerRel.includes('node') ||
    lowerRel.includes('javascript') ||
    lowerTitle.includes('react') ||
    lowerTitle.includes('nodejs') ||
    lowerTitle.includes('node.js') ||
    lowerTitle.includes('mern') ||
    lowerTitle.includes('electron') ||
    lowerTitle.includes('microservices') ||
    lowerTitle.includes('flask') ||
    lowerTitle.includes('rails') ||
    lowerTitle.includes('ruby')
  ) {
    faculty = 'Faculty of Computing'
    department = 'Software Engineering'
    coreArea = 'Full-Stack & Cloud Software Engineering'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80'
  }
  // 10. Java / C++ / C# / OOP / Python Core
  else if (
    lowerRel.includes('java') ||
    lowerRel.includes('c++') ||
    lowerRel.includes('c#') ||
    lowerRel.includes('object-oriented') ||
    lowerRel.includes('python') ||
    lowerTitle.includes('python') ||
    lowerTitle.includes('java') ||
    lowerTitle.includes('c++') ||
    lowerTitle.includes('c#') ||
    lowerTitle.includes('object-oriented')
  ) {
    faculty = 'Faculty of Computing'
    department = 'Software Engineering'
    coreArea = 'Object-Oriented & Systems Programming'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80'
  }
  // 11. HCI / UI / UX
  else if (lowerRel.includes('human-computer') || lowerTitle.includes('user interface')) {
    faculty = 'Faculty of Computing'
    department = 'Software Engineering'
    coreArea = 'Human-Computer Interaction & UI/UX'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80'
  }
  // 12. Intro to CS / Computer Science Handbook / Digital Design
  else if (lowerRel.includes('introduction to computer') || lowerTitle.includes('computer science') || lowerTitle.includes('digital design')) {
    faculty = 'Faculty of Computing'
    department = 'Computer Science'
    coreArea = 'Foundations of Computer Science'
    coverFallbackUrl = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80'
  }

  // Refine extra meta
  extraMeta = `Academic Edition • Published ${publishedYear} • Comprehensive University Text`

  // Destination path
  const targetDir = path.join(
    faculty.toLowerCase(),
    department,
    coreArea
  )
  const cleanFileName = `${title}.pdf`.replace(/[/\\?%*:|"<>]/g, '-')
  const targetRelPath = path.join(targetDir, cleanFileName)

  return {
    faculty,
    department,
    coreArea,
    title,
    author,
    extraMeta,
    publishedYear,
    coverFallbackUrl,
    fileName: cleanFileName,
    targetRelPath,
  }
}

console.log('Processing and reorganizing all drive-download books...')

for (const pdfPath of allDrivePdfs) {
  const relFromDrive = path.relative(driveDir, pdfPath)
  const meta = cleanBookMetadata(relFromDrive)
  const targetFullPath = path.join(baseDir, meta.targetRelPath)

  fs.mkdirSync(path.dirname(targetFullPath), { recursive: true })

  if (fs.existsSync(targetFullPath)) {
    // If exact name already exists, unlink source
    fs.unlinkSync(pdfPath)
  } else {
    // Hardlink or rename
    try {
      fs.linkSync(pdfPath, targetFullPath)
      fs.unlinkSync(pdfPath)
    } catch {
      fs.renameSync(pdfPath, targetFullPath)
    }
  }
}

// Clean up empty directories in drive-download
fs.rmSync(driveDir, { recursive: true, force: true })
console.log('✓ Purged old drive-download-20260929T103022Z-1-004 folder.')

// Now scan the whole src/assets/books to regenerate bookScanner.ts
console.log('Scanning unified library hierarchy to generate comprehensive catalog...')

const allUnifiedPdfs = walk(baseDir).filter((f) => f.endsWith('.pdf'))
console.log(`Total Unified Academic Textbooks: ${allUnifiedPdfs.length}`)

const catalogEntries = allUnifiedPdfs.map((fullPdfPath) => {
  const rel = path.relative(baseDir, fullPdfPath)
  const segments = rel.split(path.sep)
  
  // segments: [faculty, department, coreArea, fileName]
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

  // Derive author/meta heuristics
  let author = 'Academic Faculty & Research Committee'
  let publishedYear = '2022'
  let extraMeta = 'Core University Curriculum Edition'
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
    author,
    extraMeta,
    publishedYear,
    coverFallbackUrl,
  }
})

// Sort catalog nicely by Faculty -> Department -> CoreArea -> Title
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

fs.writeFileSync('src/utils/bookScanner.ts', bookScannerContent, 'utf8')
console.log('✓ Successfully regenerated src/utils/bookScanner.ts with the expanded catalog!')
