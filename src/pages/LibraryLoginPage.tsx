import { type FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { HiSparkles, HiBookOpen } from 'react-icons/hi2'
import logoSvg from '../assets/logo.svg'

/*
// =========================================================================
// HASHED OUT FOR ACCREDITATION: ORIGINAL STUDENT-ONLY LIBRARY LOGIN CARD
// =========================================================================
import { SEO } from '../components/common/SEO'
import { LibraryLoginCard } from '../components/library/LibraryLoginCard'

export const OriginalLibraryLoginPage: FC = () => {
  return (
    <div className="w-full flex flex-col bg-white">
      <SEO
        title="E-Library Login | Pearl University"
        description="Sign in to Pearl University Digital E-Library for 24/7 access to academic journals, e-books, research databases, and institutional publications."
      />
      <LibraryLoginCard />
    </div>
  )
}
// =========================================================================
*/

export const LibraryLoginPage: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Seamless immediate connection into public library repository
    const timer = setTimeout(() => {
      navigate('/library/dashboard', { replace: true })
    }, 450)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1B0A37] via-[#200441] to-[#3B1566] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      <Helmet>
        <title>Connecting to e-Library | Pearl University</title>
      </Helmet>

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FDE88C]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 flex flex-col items-center text-center max-w-sm"
      >
        <div className="w-20 h-20 rounded-3xl bg-white p-3.5 shadow-2xl mb-6 flex items-center justify-center relative">
          <img
            src={logoSvg}
            alt="Pearl University Emblem"
            className="w-full h-full object-contain"
          />
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#FDE88C] text-[#1B0A37] flex items-center justify-center shadow-md">
            <HiSparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <h1 className="font-heading text-xl sm:text-2xl font-medium tracking-tight text-white leading-tight">
          Pearl University
        </h1>
        <p className="text-xs uppercase font-mono tracking-widest text-[#FDE88C] mt-1 font-semibold">
          Digital e-Library Repository
        </p>

        {/* Pulsing loading bar */}
        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mt-6 relative">
          <div className="h-full bg-gradient-to-r from-[#FDE88C] to-purple-400 rounded-full animate-pulse w-3/4" />
        </div>

        <p className="text-[11px] text-white/60 font-mono mt-3 flex items-center gap-1.5">
          <HiBookOpen className="w-3.5 h-3.5 text-[#FDE88C]" />
          <span>Opening Academic Catalogue...</span>
        </p>
      </motion.div>
    </div>
  )
}

