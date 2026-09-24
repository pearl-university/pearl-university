import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HiBars3, HiXMark } from 'react-icons/hi2'
import logoSvg from '../../assets/logo.svg'

interface NavItem {
  name: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Academics', href: '/academics' },
  { name: 'About', href: '/about' },
  { name: 'Portals', href: '/portals' },
  { name: 'News and Event', href: '/news-and-event' },
  { name: 'Contact', href: '/contact' },
]

export const Navbar: FC = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isOverHero, setIsOverHero] = useState(true)
  const [hidden, setHidden] = useState(false)

  // Track scroll position, check if navbar is over HeroSection, and handle hide-nav targets
  useEffect(() => {
    let animationFrameId: number

    const checkNavbarState = () => {
      const hero =
        document.querySelector('[data-hero-section="true"]') ||
        document.getElementById('hero-section')

      if (hero) {
        const rect = hero.getBoundingClientRect()
        // If the bottom of the hero section is still below navbar height (~80px)
        setIsOverHero(rect.bottom > 80)
      } else {
        // If there's no hero section on the current page, always use solid white theme
        setIsOverHero(false)
      }

      // Check for elements that request hiding the navbar entirely (e.g. specialized full-bleed viewers)
      const hideTargets = document.querySelectorAll('[data-hide-nav="true"]')
      let shouldHide = false
      hideTargets.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 30) {
          shouldHide = true
        }
      })
      setHidden(shouldHide)
    }

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(checkNavbarState)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Run immediate check and delayed check (to allow DOM mounting of new route's hero)
    checkNavbarState()
    const timeoutId = setTimeout(checkNavbarState, 60)

    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname])

  // Lock body scroll when mobile offcanvas is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          y: hidden ? -100 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          isOverHero
            ? 'bg-transparent border-b border-transparent text-white'
            : 'bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100 text-gray-900'
        }`}
      >
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo Section */}
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 rounded-lg p-1"
              aria-label="Pearl University Home"
            >
              <img
                src={logoSvg}
                alt="Pearl University Crest"
                className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className={`h-10 w-[1.5px] transition-colors duration-300 ${
                  isOverHero ? 'bg-white/40' : 'bg-gray-300/80'
                }`}
              />
              <div className="flex flex-col text-left">
                <span
                  className={`font-heading text-sm md:text-base font-bold tracking-[0.08em] leading-tight transition-colors duration-300 ${
                    isOverHero ? 'text-white drop-shadow-sm' : 'text-[#200441]'
                  }`}
                >
                  PEARL
                </span>
                <span
                  className={`font-heading text-xs md:text-sm font-semibold tracking-[0.14em] leading-tight transition-colors duration-300 ${
                    isOverHero ? 'text-white drop-shadow-sm' : 'text-[#200441]'
                  }`}
                >
                  UNIVERSITY
                </span>
                <span
                  className={`text-[10px] md:text-[11px] font-normal tracking-normal mt-0.5 leading-none transition-colors duration-300 ${
                    isOverHero ? 'text-white/80' : 'text-gray-500'
                  }`}
                >
                  Building value
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `text-base font-medium transition-colors duration-200 relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 rounded ${
                      isOverHero
                        ? isActive
                          ? 'text-white font-semibold drop-shadow-sm'
                          : 'text-white/85 hover:text-white drop-shadow-sm'
                        : isActive
                        ? 'text-[#200441] font-semibold'
                        : 'text-gray-600 hover:text-[#200441]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-pill"
                          className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-colors duration-300 ${
                            isOverHero ? 'bg-white' : 'bg-[#200441]'
                          }`}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 cursor-pointer ${
                  isOverHero
                    ? 'text-white hover:bg-white/15'
                    : 'text-gray-800 hover:text-[#200441] hover:bg-gray-100'
                }`}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {isOpen ? (
                  <HiXMark className="w-7 h-7" />
                ) : (
                  <HiBars3 className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Offcanvas Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div
            id="mobile-navigation"
            className="fixed inset-0 z-[9999] lg:hidden flex justify-end"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-[85%] max-w-sm bg-white h-[100dvh] shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={logoSvg}
                    alt="Pearl University Crest"
                    className="h-10 w-10 object-contain"
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-heading text-xs font-bold tracking-wider text-[#200441] leading-none">
                      PEARL
                    </span>
                    <span className="font-heading text-[10px] font-semibold tracking-wider text-[#200441] leading-tight">
                      UNIVERSITY
                    </span>
                    <span className="text-[9px] font-normal text-gray-500 leading-none mt-0.5">
                      Building value
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="p-2.5 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Close menu"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Nav Links */}
              <div className="flex-1 px-5 py-6 flex flex-col gap-2 overflow-y-auto bg-white">
                {NAV_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index, duration: 0.2 }}
                  >
                    <NavLink
                      to={item.href}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3.5 rounded-xl text-base transition-all ${
                          isActive
                            ? 'bg-[#200441] text-white font-semibold shadow-xs'
                            : 'text-gray-800 hover:bg-gray-100 font-medium'
                        }`
                      }
                    >
                      <span>{item.name}</span>
                      <span className="text-xs opacity-70">→</span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                <p className="text-xs text-gray-500 text-center">
                  © {new Date().getFullYear()} Pearl University. All rights reserved.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
