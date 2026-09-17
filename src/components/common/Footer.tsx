import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from 'react-icons/fa6'

export const Footer: FC = () => {
  return (
    <footer className="w-full bg-[#141416] text-white pt-16 sm:pt-20 md:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      {/* Huge Brand Heading */}
      <div className="w-full mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-[88px] xl:text-[104px] font-normal tracking-[0.03em] leading-none text-white font-heading select-none">
          PEARL UNIVERSITY
        </h2>
      </div>

      {/* Divider & Copyright / Legal Bar */}
      <div className="w-full border-t border-b border-white/15 py-5 sm:py-6 mb-12 sm:mb-16 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs sm:text-sm">
        <p className="text-gray-400 font-normal">
          © {new Date().getFullYear()} Pearl University. All Rights Reserved.
        </p>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs sm:text-[13px] font-semibold tracking-wider text-white">
          <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
            PRIVACY POLICY
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/terms-of-use" className="hover:text-gray-300 transition-colors">
            TERMS OF USE
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/accessibility" className="hover:text-gray-300 transition-colors">
            ACCESSIBILITY
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/policies" className="hover:text-gray-300 transition-colors">
            POLICIES
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/status-and-accreditation" className="hover:text-gray-300 transition-colors">
            STATUS & ACCREDITATION
          </Link>
        </div>
      </div>

      {/* 4 Main Footer Navigation Columns */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Column 1: University */}
        <div className="lg:col-span-3 flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            University
          </h3>
          <ul className="flex flex-col gap-3 sm:gap-3.5 mt-5">
            <li>
              <Link to="/about" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                About Pearl
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Vision & Mission
              </Link>
            </li>
            <li>
              <Link to="/news-and-event" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                News & Events
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Leadership & Governance
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Status & Accreditation
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Academics */}
        <div className="lg:col-span-3 flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Academics
          </h3>
          <ul className="flex flex-col gap-3 sm:gap-3.5 mt-5">
            <li>
              <Link to="/academics" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Faculties
              </Link>
            </li>
            <li>
              <Link to="/academics" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Academic Programmes
              </Link>
            </li>
            <li>
              <Link to="/academics" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Research & Innovation
              </Link>
            </li>
            <li>
              <Link to="/academics" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Academic Calendar
              </Link>
            </li>
            <li>
              <Link to="/library" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Library & E-Library
              </Link>
            </li>
            <li>
              <Link to="/academics" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Teaching & Learning
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Student Resources */}
        <div className="lg:col-span-3 flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Student Resources
          </h3>
          <ul className="flex flex-col gap-3 sm:gap-3.5 mt-5">
            <li>
              <Link to="/admissions" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Admissions
              </Link>
            </li>
            <li>
              <Link to="/portals" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Student Portal
              </Link>
            </li>
            <li>
              <Link to="/portals" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Staff Portal
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Student Support
              </Link>
            </li>
            <li>
              <Link to="/careers" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Careers & SIWES
              </Link>
            </li>
            <li>
              <Link to="/portals" className="text-sm sm:text-[15px] text-gray-300/90 hover:text-white transition-colors">
                Learning Management System
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: University Address & Socials */}
        <div className="lg:col-span-3 flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            University Address
          </h3>

          <div className="flex flex-col gap-5 mt-5">
            {/* Take-off campus */}
            <div>
              <span className="block text-xs font-semibold text-gray-300 tracking-wider">
                TAKE-OFF CAMPUS:
              </span>
              <p className="text-xs sm:text-[13px] text-gray-400 font-normal leading-relaxed mt-1 uppercase">
                100 Murtala Muhammed
                <br />
                Highway, Calabar, Cross River
                <br />
                State, Nigeria.
              </p>
            </div>

            {/* Planned permanent site */}
            <div>
              <span className="block text-xs font-semibold text-gray-300 tracking-wider">
                PLANNED PERMANENT SITE
              </span>
              <p className="text-xs sm:text-[13px] text-gray-400 font-normal leading-relaxed mt-1 uppercase">
                Nde-Ikom, Cross River State,
                <br />
                Nigeria.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 mt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>

              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-200"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-200"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
