import type { FC } from 'react'
import { SEO } from '../components/common/SEO'
import { StudentDashboardLayout } from '../components/student/dashboard/StudentDashboardLayout'
import { AcceptanceFeeHero } from '../components/student/admission/AcceptanceFeeHero'
import { OnlineScreeningList } from '../components/student/admission/OnlineScreeningList'

export const OnlineScreeningPage: FC = () => {
  return (
    <StudentDashboardLayout
      title="Online Screening"
      subtitle="Upload and verify your academic screening credentials for institutional clearance."
    >
      <SEO
        title="Online Screening | Pearl University Student Portal"
        description="Upload required academic credentials, JAMB result slips, certificates of origin, and attestation letters for Pearl University verification."
      />

      {/* Main Content Layout matching s4.png */}
      <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-10">
        {/* 1. Student Profile Hero Banner */}
        <AcceptanceFeeHero />

        {/* 2. Screening Documents Upload List Card */}
        <OnlineScreeningList />
      </div>
    </StudentDashboardLayout>
  )
}
