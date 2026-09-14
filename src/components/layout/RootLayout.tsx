import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../common/Navbar'
import { Footer } from '../common/Footer'
import { SmoothScroll } from './SmoothScroll'

export const RootLayout: FC = () => {
  return (
    <SmoothScroll>
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
