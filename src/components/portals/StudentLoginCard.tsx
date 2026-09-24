import type { FC } from 'react'
import studentAuthImg from '../../assets/images/home/img10.webp'
import { PortalLoginCard } from '../common/PortalLoginCard'

export const StudentLoginCard: FC = () => {
  return (
    <PortalLoginCard
      title="Welcome to Your Academic Portal."
      subtitle="Access your academic records, course registration, semester results, timetable schedules, and student financial services."
      portalName="Pearl University Student Portal"
      imageSrc={studentAuthImg}
      imageAlt="Pearl University undergraduate student smiling on campus"
      redirectPath="/student/dashboard"
      idPlaceholder="Student ID"
      idAriaLabel="Student ID or Institutional Email"
      loaderText="Authenticating with Pearl Student Portal gateway..."
      successBannerText="Access Granted! Welcome to Pearl University Student Portal."
    />
  )
}
