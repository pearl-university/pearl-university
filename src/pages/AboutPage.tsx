import type { FC } from 'react'
import { SEO } from '../components/common/SEO'
import { HeroSection } from '../components/home/HeroSection'
import aboutHeroImg from '../assets/images/about/img1.png'
import { AboutJourneySection } from '../components/about/AboutJourneySection'
import { MissionVisionSection } from '../components/about/MissionVisionSection'
import { ViceChancellorSection } from '../components/about/ViceChancellorSection'

export const AboutPage: FC = () => {
  return (
    <div className="w-full flex flex-col">
      <SEO
        title="About Us | Pearl University"
        description="Discover Pearl University's journey, academic mission, vision, leadership, and unwavering commitment to nurturing intellect, character, and global impact."
      />
      <HeroSection
        backgroundImage={aboutHeroImg}
        alt="Pearl University Campus and Academic Community"
        title={
          <>
            Building More Than a
            <br className="hidden sm:inline" />{' '}
            University. Shaping
            <br className="hidden sm:inline" />{' '}
            Futures.
          </>
        }
        description="At Pearl University, we believe education should do more than prepare students for careers; it should shape character, inspire ambition, and equip every learner with the knowledge, confidence, and purpose to make a meaningful difference."
      />
      <AboutJourneySection />
      <MissionVisionSection />
      <ViceChancellorSection />
    </div>
  )
}
