import type { FC } from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  jsonLd?: Record<string, unknown>
}

const DEFAULT_TITLE = 'Pearl University | Building Value through Excellence, Innovation & Research'
const DEFAULT_DESCRIPTION =
  'Pearl University is a premier higher education institution dedicated to academic depth, innovative research, and leadership across Computing, Health Sciences, Management, and Social Sciences.'
const DEFAULT_KEYWORDS =
  'Pearl University, higher education, university in Nigeria, computing science, software engineering, cybersecurity, public health, hospital management, accounting and finance, Calabar university, undergraduate programmes, research institution'
const DEFAULT_OG_IMAGE = '/logo.svg'
const SITE_NAME = 'Pearl University'
const BASE_URL = 'https://pearluniversity.edu.ng'

export const SEO: FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl = BASE_URL,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
}) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'Pearl University',
    alternateName: 'Pearl Uni',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    slogan: 'Building Value',
    description: DEFAULT_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '100 Murtala Muhammed Highway',
      addressLocality: 'Calabar',
      addressRegion: 'Cross River State',
      addressCountry: 'NG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Admissions & Inquiries',
      email: 'info@pearluniversity.edu.ng',
    },
    sameAs: [
      'https://www.instagram.com/pearl_university',
      'https://www.linkedin.com/school/pearl-university',
    ],
  }

  const schemaToRender = jsonLd || defaultSchema

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Pearl University" />
      <meta name="application-name" content="Pearl University" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Theme & Branding */}
      <meta name="theme-color" content="#200441" />
      <meta name="msapplication-TileColor" content="#200441" />

      {/* Open Graph (Facebook / LinkedIn) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content="Pearl University Crest Logo" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@pearl_uni" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content="Pearl University Crest Logo" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">{JSON.stringify(schemaToRender)}</script>
    </Helmet>
  )
}
