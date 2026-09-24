import type { FC } from 'react'
import { SEO } from '../components/common/SEO'
import { StudentLoginCard } from '../components/portals/StudentLoginCard'

export const StudentLoginPage: FC = () => {
  return (
    <div className="w-full flex flex-col bg-white">
      <SEO
        title="Student Portal Login | Pearl University"
        description="Sign in to Pearl University Student Portal for undergraduate and postgraduate course registration, semester grade reports, academic transcripts, and fee management."
      />
      <StudentLoginCard />
    </div>
  )
}
