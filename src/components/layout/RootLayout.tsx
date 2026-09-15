import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../common/Navbar'
import { Footer } from '../common/Footer'
import { SmoothScroll } from './SmoothScroll'
import { ScrollToTop } from './ScrollToTop'

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
      </div>
    </SmoothScroll>
  )
}
