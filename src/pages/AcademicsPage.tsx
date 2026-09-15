import type { FC } from 'react'
import { SEO } from '../components/common/SEO'
import { HeroSection } from '../components/home/HeroSection'
import academicsHeroImg from '../assets/images/academics/img1.webp'
import { ApproachSection } from '../components/academics/ApproachSection'
import { AcademicServicesSection } from '../components/academics/AcademicServicesSection'
import { AcademicProgrammesTableSection } from '../components/academics/AcademicProgrammesTableSection'

export const AcademicsPage: FC = () => {
  return (
    <div className="w-full flex flex-col">
      <SEO
        title="Academics & Programmes | Pearl University"
        description="Explore Pearl University undergraduate and graduate academic faculties, accredited degree programmes, faculty research centres, and global curriculum standards."
      />
      <HeroSection
        backgroundImage={academicsHeroImg}
        alt="Pearl University Academics and Lecture Facilities"
        title={
          <>
            Excellence in
            <br className="hidden sm:inline" />{' '}
            Knowledge & Practice
          </>
        }
        description="We challenge minds, strengthen character, and transform knowledge into the confidence, capability, and purpose to make a meaningful difference in the world, preparing students to lead with clarity, adapt with confidence, and create lasting value."
      />
      <ApproachSection />
      <div className='my-7' />
      <AcademicServicesSection />
      <AcademicProgrammesTableSection />
    </div>
  )
}
