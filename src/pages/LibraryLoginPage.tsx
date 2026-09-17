import type { FC } from 'react'
import { SEO } from '../components/common/SEO'
import { LibraryLoginCard } from '../components/library/LibraryLoginCard'

export const LibraryLoginPage: FC = () => {
  return (
    <div className="w-full flex flex-col bg-white">
      <SEO
        title="E-Library Login | Pearl University"
        description="Sign in to Pearl University Digital E-Library for 24/7 access to academic journals, e-books, research databases, and institutional publications."
      />
      <LibraryLoginCard />
    </div>
  )
}
