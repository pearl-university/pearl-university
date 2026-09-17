// Dynamic Book Library Catalog & Scanner
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
  // ── Faculty of Computing -> B.SC Computer Science ──────────────────────────
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Computer Science',
    coreArea: 'Artificial Intelligence',
    fileName: 'Artificial Intelligience - A modern Approach.pdf',
    storagePath:
      'faculty of computing/B.SC Computer Science/artificial intelligience/Artificial Intelligience - A modern Approach.pdf',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    extraMeta: '4th Global Edition • Pearson Publishing',
    publishedYear: '2021',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Computer Science',
    coreArea: 'Computer Architecture',
    fileName: 'Computer Organization And Design.pdf',
    storagePath:
      'faculty of computing/B.SC Computer Science/computer architecture/Computer Organization And Design.pdf',
    title: 'Computer Organization and Design',
    author: 'David A. Patterson & John L. Hennessy',
    extraMeta: 'The Hardware/Software Interface • 5th Edition • Morgan Kaufmann',
    publishedYear: '2018',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Computer Science',
    coreArea: 'Computer Networks',
    fileName: 'Computer Networking A Top-Down Approach.pdf',
    storagePath:
      'faculty of computing/B.SC Computer Science/computer networks/Computer Networking A Top-Down Approach.pdf',
    title: 'Computer Networking: A Top-Down Approach',
    author: 'James F. Kurose & Keith W. Ross',
    extraMeta: '7th Edition • Pearson Global Edition',
    publishedYear: '2017',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Computer Science',
    coreArea: 'Database Systems',
    fileName: 'Database-System-Concepts.pdf',
    storagePath:
      'faculty of computing/B.SC Computer Science/database systems/Database-System-Concepts.pdf',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry F. Korth & S. Sudarshan',
    extraMeta: '7th Edition • McGraw-Hill Higher Education',
    publishedYear: '2019',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Computer Science',
    coreArea: 'Operating Systems',
    fileName: 'Operating System Concepts.pdf',
    storagePath:
      'faculty of computing/B.SC Computer Science/operating systems/Operating System Concepts.pdf',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz, Peter B. Galvin & Greg Gagne',
    extraMeta: '10th Edition • Wiley Publishing',
    publishedYear: '2018',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Computer Science',
    coreArea: 'Programming & Algorithms',
    fileName: 'Introduction To Algorithms.pdf',
    storagePath:
      'faculty of computing/B.SC Computer Science/programming & algorithms/Introduction To Algorithms.pdf',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest & Clifford Stein',
    extraMeta: '3rd Edition • MIT Press & McGraw-Hill',
    publishedYear: '2009',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1516116211227-bbc141872147?w=400&auto=format&fit=crop&q=80',
  },

  // ── Faculty of Computing -> B.SC Cyber Security ───────────────────────────
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Cyber Security',
    coreArea: 'Cryptography',
    fileName: 'Cryptography & Network Security.pdf',
    storagePath:
      'faculty of computing/B.SC Cyber Security/Cryptography/Cryptography & Network Security.pdf',
    title: 'Cryptography and Network Security',
    author: 'William Stallings',
    extraMeta: 'Principles and Practice • 7th Edition • Pearson',
    publishedYear: '2017',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Cyber Security',
    coreArea: 'Cyber Security',
    fileName: 'Computer Security - Principles & Practice.pdf',
    storagePath:
      'faculty of computing/B.SC Cyber Security/Cyber Security/Computer Security - Principles & Practice.pdf',
    title: 'Computer Security: Principles and Practice',
    author: 'William Stallings & Lawrie Brown',
    extraMeta: '4th Edition • Pearson Global Edition',
    publishedYear: '2018',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Cyber Security',
    coreArea: 'Digital Forensics',
    fileName: 'Digital Evidence And Computer Crime Third.pdf',
    storagePath:
      'faculty of computing/B.SC Cyber Security/Digital Forensics/Digital Evidence And Computer Crime Third.pdf',
    title: 'Digital Evidence and Computer Crime',
    author: 'Eoghan Casey',
    extraMeta: 'Forensic Science, Computers, and the Internet • 3rd Edition • Academic Press',
    publishedYear: '2011',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Cyber Security',
    coreArea: 'Ethical Hacking & Testing',
    fileName:
      "The Web Application Hacker's Handbook - Finding and Exploiting Security Flaws, 2nd Edition by Dafydd Stuttard, Marcus Pinto.pdf",
    storagePath:
      "faculty of computing/B.SC Cyber Security/Ethical Hacking & Testing/The Web Application Hacker's Handbook - Finding and Exploiting Security Flaws, 2nd Edition by Dafydd Stuttard, Marcus Pinto.pdf",
    title: "The Web Application Hacker's Handbook",
    author: 'Dafydd Stuttard & Marcus Pinto',
    extraMeta: 'Finding and Exploiting Security Flaws • 2nd Edition • Wiley',
    publishedYear: '2011',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Cyber Security',
    coreArea: 'Network Security',
    fileName: 'Network Security Essentials Applications and Standards.pdf',
    storagePath:
      'faculty of computing/B.SC Cyber Security/Network Security/Network Security Essentials Applications and Standards.pdf',
    title: 'Network Security Essentials: Applications and Standards',
    author: 'William Stallings',
    extraMeta: '6th Edition • Pearson Education',
    publishedYear: '2017',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&auto=format&fit=crop&q=80',
  },
  {
    faculty: 'Faculty of Computing',
    department: 'B.SC Cyber Security',
    coreArea: 'Security Engineering',
    fileName: 'Security Engineering.pdf',
    storagePath:
      'faculty of computing/B.SC Cyber Security/Security Engineering/Security Engineering.pdf',
    title: 'Security Engineering',
    author: 'Ross Anderson',
    extraMeta: 'A Guide to Building Dependable Distributed Systems • 3rd Edition • Wiley',
    publishedYear: '2020',
    coverFallbackUrl:
      'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&auto=format&fit=crop&q=80',
  },
]

// Build unified library catalog
function buildLibraryCatalog(): BookMetadata[] {
  return OFFICIAL_BOOK_CATALOG.map((item) => {
    const fileUrl = getSupabaseBookUrl(item.storagePath)

    const dotIndex = item.fileName.lastIndexOf('.')
    const ext = dotIndex !== -1 ? item.fileName.slice(dotIndex + 1).toLowerCase() : 'pdf'
    const id = `${item.faculty}-${item.department}-${item.coreArea}-${item.title}`
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
