import img5 from '../assets/images/home/img5.png'
import img6 from '../assets/images/home/img6.webp'
import img11 from '../assets/images/home/img11.webp'
import img12 from '../assets/images/home/img12.webp'

export interface NewsEventItem {
  id: string
  title: string
  description: string
  date: string
  category: string
  image: string
  link?: string
}

export const CATEGORIES = [
  'Seminar',
  'Culture',
  'Exhibition',
  'Sports',
  'Arts',
  'Recreation',
  'Healthcare',
]

export const NEWS_EVENTS: NewsEventItem[] = [
  {
    id: '1',
    title: 'Research Seminar Advances Dialogue on Security and Social Resilience',
    description:
      'A focused seminar exploring emerging security challenges and practical approaches to strengthening social resilience.',
    date: 'Sat 29 Aug, 2026',
    category: 'Seminar',
    image: img5,
    link: '/news-and-event',
  },
  {
    id: '2',
    title:
      'Pearl University Seminar Series Inspires Knowledge Exchange and Collaboration',
    description:
      'A seminar series fostering knowledge exchange, fresh perspectives, and meaningful collaboration.',
    date: 'Sat 29 Aug, 2026',
    category: 'Seminar',
    image: img6,
    link: '/news-and-event',
  },
  {
    id: '3',
    title:
      'Academic Seminar Examines Research, Policy, and Social Impact',
    description:
      'Exploring how research and policy can address contemporary challenges and create meaningful, lasting social impact.',
    date: 'Sat 29 Aug, 2026',
    category: 'Seminar',
    image: img12,
    link: '/news-and-event',
  },
  {
    id: '4',
    title:
      'A Discussion on Digital Transformation and Responsible Innovation',
    description:
      'Advancing dialogue on digital transformation, responsible innovation, and their role in shaping sustainable progress.',
    date: 'Sat 29 Aug, 2026',
    category: 'Seminar',
    image: img11,
    link: '/news-and-event',
  },
]
