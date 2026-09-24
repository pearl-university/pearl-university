import type { FC } from 'react'
import { SEO } from '../components/common/SEO'
import { StudentDashboardLayout } from '../components/student/dashboard/StudentDashboardLayout'
import { AcceptanceFeeHero } from '../components/student/admission/AcceptanceFeeHero'
import { AcceptanceFeeFormCard } from '../components/student/admission/AcceptanceFeeFormCard'

export const AcceptanceFeePaymentPage: FC = () => {
  return (
    <StudentDashboardLayout
      title="Pay Acceptance Fees"
      subtitle="Confirm your admission and generate your acceptance fee invoice."
    >
      <SEO
        title="Pay Acceptance Fees | Pearl University Student Portal"
        description="Confirm your admission offer and generate your official acceptance fee invoice for Pearl University."
      />

      {/* Main Content Layout matching s2.png */}
      <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-10">
        {/* 1. Student Profile Hero Banner */}
        <AcceptanceFeeHero />

        {/* 2. Acceptance Fee Payment Form Card */}
        <AcceptanceFeeFormCard />
      </div>
    </StudentDashboardLayout>
  )
}
