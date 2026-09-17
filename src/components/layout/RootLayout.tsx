import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../common/Navbar'
import { Footer } from '../common/Footer'
import { SmoothScroll } from './SmoothScroll'
import { ScrollToTop } from './ScrollToTop'
import { AlertToastsContainer } from '../ui/AlertToasts'
import { BottomPillLoader } from '../ui/BottomPillLoader'
import { ConfirmModal } from '../ui/ConfirmModal'

export const RootLayout: FC = () => {
  return (
    <SmoothScroll>
      <ScrollToTop />
      <div className="min-h-screen w-full flex flex-col bg-white text-black antialiased selection:bg-[#200441] selection:text-white">
        <Navbar />

        <main className="flex-1 w-full">
          <Outlet />
        </main>

        <Footer />

        {/* Global Basic UI Elements */}
        <BottomPillLoader />
        <AlertToastsContainer />
        <ConfirmModal />
      </div>
    </SmoothScroll>
  )
}


