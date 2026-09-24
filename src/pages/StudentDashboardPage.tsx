import type { FC } from 'react'
import { SEO } from '../components/common/SEO'
import { StudentDashboardLayout } from '../components/student/dashboard/StudentDashboardLayout'
import { StudentProfileHero } from '../components/student/dashboard/StudentProfileHero'
import { OutstandingFeesCard } from '../components/student/dashboard/OutstandingFeesCard'
import { RecentPaymentsCard } from '../components/student/dashboard/RecentPaymentsCard'
import { CoursesTableCard } from '../components/student/dashboard/CoursesTableCard'

export const StudentDashboardPage: FC = () => {
  return (
    <StudentDashboardLayout>
      <SEO
        title="Student Portal Dashboard | Pearl University"
        description="View your student profile, academic progress, registered semester courses, outstanding tuition fees, and payment receipts."
      />

      {/* Main Content Layout matching s1.png */}
      <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-10">
        {/* 1. Student Profile Hero Banner */}
        <StudentProfileHero />

        {/* 2. Middle Row: Outstanding Fees & Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <OutstandingFeesCard />
          <RecentPaymentsCard />
        </div>

        {/* 3. Bottom Row: Registered Courses Table */}
        <CoursesTableCard />
      </div>
    </StudentDashboardLayout>
  )
}
