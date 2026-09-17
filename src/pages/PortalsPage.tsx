import type { FC } from 'react'
import { SEO } from '../components/common/SEO'
import { HeroSection } from '../components/home/HeroSection'
import portalHeroImg from '../assets/images/portal/img1.webp'
import { PortalsServicesSection } from '../components/portals/PortalsServicesSection'
import { StaffAdministrativeToolsSection } from '../components/portals/StaffAdministrativeToolsSection'

export const PortalsPage: FC = () => {
  return (
    <div className="w-full flex flex-col">
      <SEO
        title="Portals & Digital Services | Pearl University"
        description="Access Pearl University student portal, e-learning management system, digital library resources, staff administration, and institutional services."
      />
      <HeroSection
        backgroundImage={portalHeroImg}
        alt="Pearl University Digital Services and Portals"
        title={
          <>
            Gateway to Digital
            <br className="hidden sm:inline" />{' '}
            Learning & Services
          </>
        }
        description="Access essential university portals and digital platforms for course registration, academic records, e-learning materials, research repositories, and campus administration."
      />
      <PortalsServicesSection />
      <StaffAdministrativeToolsSection />
    </div>
  )
}


