import type { FC } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineCreditCard } from 'react-icons/hi2'
import { RECENT_PAYMENTS_DATA } from '../../../data/studentData'
import { useUI } from '../../../context/UIContext'

export const RecentPaymentsCard: FC = () => {
  const { alert } = useUI()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="w-full bg-[#1b0a33]/80 border border-[#3b1f66] rounded-[24px] p-6 sm:p-7 text-white shadow-xl backdrop-blur-md flex flex-col justify-between"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#38205c] border border-white/10 flex items-center justify-center text-gray-200">
            <HiOutlineCreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Recent Payment
          </h3>
        </div>
        <button
          type="button"
          onClick={() => alert.info('Receipts', 'Viewing verified bursary receipts.')}
          className="text-xs text-gray-400 hover:text-white transition-colors font-medium cursor-pointer"
        >
          View all
        </button>
      </div>

      {/* Payment Records List */}
      <div className="divide-y divide-white/10 mt-3">
        {RECENT_PAYMENTS_DATA.map((payment) => (
          <div
            key={payment.id}
            className="py-4.5 first:pt-2 last:pb-1 flex items-center justify-between gap-4"
          >
            <div className="flex flex-col">
              <span className="text-sm sm:text-[15px] font-bold text-white tracking-tight">
                {payment.session} • {payment.level}
              </span>
              <span className="text-xs text-gray-400 font-normal mt-0.5">
                {payment.type} • {payment.level} • {payment.date}
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight font-mono">
                {payment.formattedAmount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
