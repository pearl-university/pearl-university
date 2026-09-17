export interface BookItem {
  id: string
  title: string
  authors: string
  category: string
  coverUrl: string
  subCategory?: string
  readCount?: string
  rating?: number
}

export const SUGGESTED_READS: BookItem[] = [
  {
    id: 'sug-1',
    title: 'Cost Accounting: A Managerial Emphasis',
    authors: 'Horngren et al.',
    category: 'Accounting',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'sug-2',
    title: 'Introduction to Health Care Management',
    authors: 'Buchbinder, Shanks & Kite',
    category: 'Health Care Administration & Hospital Management',
    coverUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'sug-3',
    title: 'Essentials of Biostatistics in Public Health',
    authors: 'Lisa M. Sullivan',
    category: 'Public Health',
    coverUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'sug-4',
    title: 'Computer Networking: A Top-Down Approach',
    authors: 'Kurose & Ross',
    category: 'Computer science',
    coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80',
  },
]

export const TOP_READS: BookItem[] = [
  {
    id: 'top-1',
    title: 'Cost Accounting: A Managerial Emphasis',
    authors: 'Horngren et al.',
    category: 'Accounting',
    coverUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'top-2',
    title: 'Introduction to Health Care Management',
    authors: 'Buchbinder, Shanks & Kite',
    category: 'Health Care Administration & Hospital Management',
    coverUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'top-3',
    title: 'Essentials of Biostatistics in Public Health',
    authors: 'Lisa M. Sullivan',
    category: 'Public Health',
    coverUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'top-4',
    title: 'Computer Networking: A Top-Down Approach',
    authors: 'Kurose & Ross',
    category: 'Computer science',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
  },
]

export const RECENTLY_ADDED: BookItem[] = [
  {
    id: 'rec-1',
    title: 'Computer Networking: A Top-Down Approach',
    authors: 'Kurose & Ross',
    category: 'Computer science',
    coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec-2',
    title: 'Cost Accounting: A Managerial Emphasis',
    authors: 'Kurose & Ross',
    category: 'Computer science',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec-3',
    title: 'Introduction to Health Care Management',
    authors: 'Kurose & Ross',
    category: 'Computer science',
    coverUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec-4',
    title: 'Essentials of Biostatistics in Public Health',
    authors: 'Kurose & Ross',
    category: 'Computer science',
    coverUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec-5',
    title: 'Introduction to Health Care Management',
    authors: 'Kurose & Ross',
    category: 'Computer science',
    coverUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec-6',
    title: 'Cost Accounting: A Managerial Emphasis',
    authors: 'Kurose & Ross',
    category: 'Computer science',
    coverUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80',
  },
]
