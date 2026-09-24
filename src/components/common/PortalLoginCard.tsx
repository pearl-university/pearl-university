import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { fadeInUp } from '../../utils/motion'
import { useUI } from '../../context/UIContext'
import { validateLibraryCredentials, type LibraryUser } from '../../utils/auth'
import { useAuth } from '../../context/AuthContext'

export interface PortalLoginCardProps {
  /** Main editorial headline in Libre Baskerville (e.g., <>Discover.<br />Research. Learn.</>) */
  title: ReactNode
  /** Subheading describing what the portal offers */
  subtitle: string
  /** Name of the portal displayed in notifications and loaders */
  portalName: string
  /** Image source for the right-hand column */
  imageSrc: string
  /** Image alt description */
  imageAlt: string
  /** Target path on successful authentication (default: '/library/dashboard' or '/student-dashboard') */
  redirectPath?: string
  /** Input placeholder for the primary identifier */
  idPlaceholder?: string
  /** Accessible label for the primary identifier input */
  idAriaLabel?: string
  /** Text shown during the authentication spinner */
  loaderText?: string
  /** Alert banner text upon successful login */
  successBannerText?: string
  /** Custom validation function, falls back to university auth validator */
  validateCredentials?: (
    idInput: string,
    pwInput: string
  ) => { success: boolean; user?: LibraryUser; error?: string }
}

const loginValidationSchema = Yup.object().shape({
  studentId: Yup.string()
    .trim()
    .required('Student ID or Academic Email is required')
    .min(3, 'Identifier must be at least 3 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export const PortalLoginCard: FC<PortalLoginCardProps> = ({
  title,
  subtitle,
  portalName,
  imageSrc,
  imageAlt,
  redirectPath = '/portals',
  idPlaceholder = 'Student ID',
  idAriaLabel = 'Student ID or Institutional Email',
  loaderText,
  successBannerText,
  validateCredentials = validateLibraryCredentials,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [authStatus, setAuthStatus] = useState<'idle' | 'success'>('idle')
  const navigate = useNavigate()
  const { showLoader, hideLoader, alert } = useUI()
  const { login } = useAuth()

  const defaultLoaderText = loaderText || `Authenticating with ${portalName} gateway...`
  const defaultSuccessBanner =
    successBannerText || `Access Granted! Welcome to ${portalName}.`

  const formik = useFormik({
    initialValues: {
      studentId: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setAuthStatus('idle')
      showLoader(defaultLoaderText)

      // 1.8s simulated authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1800))

      const result = validateCredentials(values.studentId, values.password)

      if (result.success && result.user) {
        login(result.user)
        hideLoader()
        setSubmitting(false)
        setAuthStatus('success')
        alert.success(
          'Authentication Successful',
          `Welcome back, ${result.user.name}. Entering ${portalName}.`
        )
        setTimeout(() => {
          navigate(redirectPath)
        }, 500)
      } else {
        hideLoader()
        setSubmitting(false)
        const errorMsg = result.error || 'Invalid ID or Password combination.'
        alert.error('Login Failed', errorMsg)
        setFieldError('password', errorMsg)
      }
    },
  })

  const isStudentIdError = Boolean(formik.touched.studentId && formik.errors.studentId)
  const isPasswordError = Boolean(formik.touched.password && formik.errors.password)

  return (
    <section className="w-full min-h-[90vh] flex items-center justify-center py-10 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white">
      <div className="w-full mx-auto">
        {/* Main Lavender Auth Card with subtle shadow */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full bg-[#ECE0EF] rounded-[28px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden p-6 sm:p-10 md:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center shadow-xl shadow-black/5"
        >
          {/* Left Column: Form & Title */}
          <div className="lg:col-span-5 flex flex-col justify-center max-w-md mx-auto lg:mx-0 w-full">
            {/* Editorial Title in Libre Baskerville */}
            <h1 className="text-4xl xs:text-5xl sm:text-[52px] md:text-[56px] font-heading font-normal leading-[1.12] text-[#200441] tracking-[-0.015em]">
              {title}
            </h1>

            <p className="text-xs sm:text-sm text-[#200441]/75 font-normal mt-3 mb-8 sm:mb-10">
              {subtitle}
            </p>

            {/* Login Form with Formik and Yup */}
            <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-5 w-full">
              {/* ID Input & Error */}
              <div className="flex flex-col">
                <div className="relative flex items-center w-full">
                  <div className="absolute left-5 text-[#200441] pointer-events-none">
                    <FiMail
                      className={`w-5 h-5 transition-opacity ${
                        isStudentIdError ? 'opacity-100 text-red-600' : 'opacity-80'
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formik.values.studentId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={idPlaceholder}
                    aria-label={idAriaLabel}
                    aria-invalid={isStudentIdError}
                    aria-describedby={isStudentIdError ? 'studentId-error' : undefined}
                    className={`w-full pl-13 pr-6 py-3.5 sm:py-4 bg-transparent rounded-full text-base sm:text-[17px] text-[#200441] placeholder:text-[#200441]/50 focus:outline-none transition-all font-normal ${
                      isStudentIdError
                        ? 'border border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-2 focus:ring-red-300/40'
                        : 'border border-[#200441]/35 focus:border-[#200441] focus:ring-2 focus:ring-[#200441]/20'
                    }`}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {isStudentIdError && (
                    <motion.div
                      id="studentId-error"
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5 px-4 pt-1.5 text-xs text-red-600 font-medium overflow-hidden"
                    >
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formik.errors.studentId}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Input & Error */}
              <div className="flex flex-col">
                <div className="relative flex items-center w-full">
                  <div className="absolute left-5 text-[#200441] pointer-events-none">
                    <FiLock
                      className={`w-5 h-5 transition-opacity ${
                        isPasswordError ? 'opacity-100 text-red-600' : 'opacity-80'
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Password"
                    aria-label="Password"
                    aria-invalid={isPasswordError}
                    aria-describedby={isPasswordError ? 'password-error' : undefined}
                    className={`w-full pl-13 pr-13 py-3.5 sm:py-4 bg-transparent rounded-full text-base sm:text-[17px] text-[#200441] placeholder:text-[#200441]/50 focus:outline-none transition-all font-normal ${
                      isPasswordError
                        ? 'border border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-2 focus:ring-red-300/40'
                        : 'border border-[#200441]/35 focus:border-[#200441] focus:ring-2 focus:ring-[#200441]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-5 text-[#200441]/70 hover:text-[#200441] p-1 transition-colors cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {isPasswordError && (
                    <motion.div
                      id="password-error"
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5 px-4 pt-1.5 text-xs text-red-600 font-medium overflow-hidden"
                    >
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formik.errors.password}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Alert Feedback Messages */}
              <AnimatePresence mode="wait">
                {authStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-normal shadow-xs"
                  >
                    <FiCheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{defaultSuccessBanner}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full mt-2 py-4 px-8 rounded-full bg-[#200441] text-white text-base sm:text-lg font-medium hover:bg-[#2e065c] active:bg-[#180330] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#200441]/30"
              >
                {formik.isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>

            {/* Bottom Support & Helpers */}
            <div className="mt-6 flex flex-wrap items-center justify-end text-xs sm:text-sm text-[#200441]/75 gap-2">
              <Link
                to="/portals"
                className="hover:text-[#200441] transition-colors inline-flex items-center gap-1 font-medium"
              >
                <span>← All Portals</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Portal Photo with Rounded Corners */}
          <div className="lg:col-span-7 w-full h-full flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[14/11] lg:aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl shadow-black/10 bg-gray-200 group">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
