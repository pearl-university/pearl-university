import type { FC } from 'react'
import libraryAuthImg from '../../assets/images/library-auth/img1.webp'
import { PortalLoginCard } from '../common/PortalLoginCard'

export const LibraryLoginCard: FC = () => {
  return (
    <PortalLoginCard
      title={
        <>
          Discover.
          <br />
          Research. Learn.
        </>
      }
      subtitle="Access the Pearl University Digital Library Catalogue, research repositories, e-journals, and databases."
      portalName="Pearl University E-Library"
      imageSrc={libraryAuthImg}
      imageAlt="Pearl University students smiling and collaborating in the modern library"
      redirectPath="/library/dashboard"
      idPlaceholder="Student ID"
      idAriaLabel="Student ID or Institutional Email"
      loaderText="Authenticating with Pearl e-Library gateway..."
      successBannerText="Access Granted! Welcome to Pearl University E-Library."
    />
  )
}
