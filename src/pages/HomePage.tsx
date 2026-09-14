import type { FC } from 'react'
import { SEO } from '../components/common/SEO'
import { HeroSection } from '../components/home/HeroSection'
// import { MarqueeTicker } from '../components/common/MarqueeTicker'
import { FacultiesSection } from '../components/home/FacultiesSection'
import { AcademicProgramsSection } from '../components/home/AcademicProgramsSection'
import { PortalsSection } from '../components/home/PortalsSection'
import { NewsAndEventsSection } from '../components/home/NewsAndEventsSection'
import { ExperienceGallerySection } from '../components/home/ExperienceGallerySection'

export const HomePage: FC = () => {
  return (
    <div className="w-full flex flex-col">
      <SEO />
      <HeroSection />
      {/* <MarqueeTicker /> */}
      <FacultiesSection />
      <AcademicProgramsSection />
      <PortalsSection />
      <NewsAndEventsSection />
      <ExperienceGallerySection />
    </div>
  )
}
