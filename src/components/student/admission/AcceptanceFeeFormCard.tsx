import type { FC } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineCreditCard } from 'react-icons/hi2'
import { FiCheckCircle } from 'react-icons/fi'
import { AcceptanceFeePaymentModal } from './AcceptanceFeePaymentModal'

export const AcceptanceFeeFormCard: FC = () => {
  const [isPaid, setIsPaid] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const feeAmountFormatted = 'N45,500.00'

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full bg-[#1b0a33]/80 border border-[#3b1f66] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden backdrop-blur-md"
      >
        {/* Card Header */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#38205c] border border-white/10 flex items-center justify-center text-gray-200 shrink-0">
            <HiOutlineCreditCard className="w-5 h-5 text-gray-200" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Acceptance Fee Payment - {feeAmountFormatted}
          </h3>
        </div>

        {/* Success Notification Banner */}
        <AnimatePresence>
          {isPaid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm font-medium"
            >
              <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Invoice #ACC-2026-0842 generated and verified. Your admission is officially accepted!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4-Field Form Grid */}
        <form onSubmit={handleOpenModal} className="mt-8 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Full Name */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="fullName"
                className="text-xs sm:text-[13px] font-medium text-gray-300 flex items-center gap-0.5"
              >
                <span>Full name</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                defaultValue="John Odiong Offiong"
                readOnly
                className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-[#130623] border border-[#381f5e] text-white text-sm sm:text-base font-normal focus:outline-none focus:border-[#FDE88C] transition-colors"
              />
            </div>

            {/* JAMB Registration Number */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="jambReg"
                className="text-xs sm:text-[13px] font-medium text-gray-300 flex items-center gap-0.5"
              >
                <span>JAMB Registration Number</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                id="jambReg"
                defaultValue="2026108911FG"
                readOnly
                className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-[#130623] border border-[#381f5e] text-white text-sm sm:text-base font-mono font-normal focus:outline-none focus:border-[#FDE88C] transition-colors"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="emailAddress"
                className="text-xs sm:text-[13px] font-medium text-gray-300 flex items-center gap-0.5"
              >
                <span>Email address</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="email"
                id="emailAddress"
                defaultValue="john.offiong@pearl.edu.ng"
                readOnly
                className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-[#130623] border border-[#381f5e] text-white text-sm sm:text-base font-normal focus:outline-none focus:border-[#FDE88C] transition-colors"
              />
            </div>

            {/* Programme */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="programme"
                className="text-xs sm:text-[13px] font-medium text-gray-300 flex items-center gap-0.5"
              >
                <span>Programme</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                id="programme"
                defaultValue="Computer Science"
                readOnly
                className="w-full px-5 py-3.5 sm:py-4 rounded-xl bg-[#130623] border border-[#381f5e] text-white text-sm sm:text-base font-normal focus:outline-none focus:border-[#FDE88C] transition-colors"
              />
            </div>
          </div>

          {/* Large Central Submit Action Button that opens Modal */}
          <div className="pt-4 sm:pt-6 flex justify-center">
            <button
              type="submit"
              className="w-full max-w-md py-4 px-8 rounded-full bg-[#FDE88C] hover:bg-[#FFE57A] active:scale-95 text-[#160829] font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isPaid ? 'View Invoice / Receipt' : `Pay (${feeAmountFormatted})`}</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Acceptance Fee Payment Modal matching s3.png */}
      <AcceptanceFeePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPaymentSuccess={() => setIsPaid(true)}
      />
    </>
  )
}
