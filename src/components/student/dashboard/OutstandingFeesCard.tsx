import type { FC } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineCreditCard } from 'react-icons/hi2'
import { OUTSTANDING_FEES_DATA, type OutstandingFee } from '../../../data/studentData'
import { useUI } from '../../../context/UIContext'

export const OutstandingFeesCard: FC = () => {
  const { alert } = useUI()

  const handlePayFee = (fee: OutstandingFee) => {
    alert.info(
      `Payment Gateway: ${fee.title}`,
      `Redirecting to secure university gateway for ${fee.title} (${fee.formattedAmount}).`
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full bg-[#1b0a33]/80 border border-[#3b1f66] rounded-[24px] p-6 sm:p-7 text-white shadow-xl backdrop-blur-md flex flex-col justify-between"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#38205c] border border-white/10 flex items-center justify-center text-gray-200">
            <HiOutlineCreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Outstanding fees
          </h3>
        </div>
        <button
          type="button"
          onClick={() => alert.info('Fees', 'Viewing all registered institutional levies.')}
          className="text-xs text-gray-400 hover:text-white transition-colors font-medium cursor-pointer"
        >
          View all
        </button>
      </div>

      {/* Fees List */}
      <div className="divide-y divide-white/10 mt-3">
        {OUTSTANDING_FEES_DATA.map((fee) => (
          <div
            key={fee.id}
            className="py-4.5 first:pt-2 last:pb-1 flex items-center justify-between gap-4"
          >
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-normal">{fee.title}</span>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
                {fee.formattedAmount}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handlePayFee(fee)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/10 active:bg-white/15 text-white text-xs sm:text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap"
            >
              <HiOutlineCreditCard className="w-4 h-4 text-gray-300" />
              <span>{fee.buttonLabel}</span>
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
