import type { FC } from 'react'
import { useState } from 'react'
import { HiXMark, HiOutlineBuildingLibrary, HiOutlineCreditCard, HiOutlineCalendar } from 'react-icons/hi2'
import { FiCheckCircle } from 'react-icons/fi'
import { BaseModal } from '../../ui/BaseModal'
import { useUI } from '../../../context/UIContext'

export interface AcceptanceFeePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess?: () => void
}

type PaymentMethod = 'transfer' | 'card'

export const AcceptanceFeePaymentModal: FC<AcceptanceFeePaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { showLoader, hideLoader, alert } = useUI()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('transfer')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transferDetailsVisible, setTransferDetailsVisible] = useState(false)

  const feeAmount = 'N45,500.00'
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  const handlePay = async () => {
    if (selectedMethod === 'transfer') {
      setTransferDetailsVisible(true)
      return
    }

    // Card payment simulation
    setIsProcessing(true)
    showLoader('Initializing secure university card gateway...')

    await new Promise((resolve) => setTimeout(resolve, 1800))
    hideLoader()
    setIsProcessing(false)
    alert.success(
      'Acceptance Fee Payment Successful',
      `Payment of ${feeAmount} has been processed successfully via debit card.`
    )
    onPaymentSuccess?.()
    onClose()
  }

  const handleConfirmTransfer = async () => {
    setIsProcessing(true)
    showLoader('Verifying bank transfer confirmation...')

    await new Promise((resolve) => setTimeout(resolve, 1600))
    hideLoader()
    setIsProcessing(false)
    alert.success(
      'Payment Confirmed',
      `Bank transfer of ${feeAmount} has been reconciled. Admission status active!`
    )
    onPaymentSuccess?.()
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      clickOutsideToClose={true}
      className="bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-2xl relative overflow-hidden text-gray-900 border border-black/5"
    >
      {/* 1. Modal Header: Student Info & Close Button */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-4">
          {/* Lavender Avatar Box with "J" */}
          <div className="w-14 h-14 rounded-2xl bg-[#ECE0EF] flex items-center justify-center shrink-0 shadow-xs">
            <span className="font-heading text-2xl font-bold text-[#200441]">J</span>
          </div>

          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-tight">
              John Odiong Offiong
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              john.offiong@pearl.edu.ng
            </p>
          </div>
        </div>

        {/* Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <HiXMark className="w-6 h-6" />
        </button>
      </div>

      {/* 2. Fee Summary Box */}
      <div className="border border-gray-200/90 rounded-2xl p-5 sm:p-6 bg-white mb-6 shadow-xs">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium mb-1">
          <span>Acceptance Fee</span>
          <span className="flex items-center gap-1 text-gray-400 font-normal">
            <HiOutlineCalendar className="w-4 h-4" />
            <span>{todayFormatted}</span>
          </span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight font-heading">
          {feeAmount}
        </div>
      </div>

      {!transferDetailsVisible ? (
        <>
          {/* 3. Payment Method Options (2-Column Selectable Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Option 1: Pay via Bank Transfer */}
            <div
              onClick={() => setSelectedMethod('transfer')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] ${
                selectedMethod === 'transfer'
                  ? 'border-2 border-black bg-gray-50/80 shadow-xs'
                  : 'border-gray-200/90 hover:border-gray-400 bg-white'
              }`}
            >
              <div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-start text-black mb-3">
                  <HiOutlineBuildingLibrary className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 tracking-tight">
                  Pay via bank transfer
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2 font-normal">
                  You&apos;ll receive dedicated bank details to send your payment to. The bank details
                  expire after one hour.
                </p>
              </div>
            </div>

            {/* Option 2: Pay via Card Payment */}
            <div
              onClick={() => setSelectedMethod('card')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] ${
                selectedMethod === 'card'
                  ? 'border-2 border-black bg-gray-50/80 shadow-xs'
                  : 'border-gray-200/90 hover:border-gray-400 bg-white'
              }`}
            >
              <div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-start text-black mb-3">
                  <HiOutlineCreditCard className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 tracking-tight">
                  Pay via card payment
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2 font-normal">
                  Pay your acceptance fee securely using your debit or credit card through the
                  online payment gateway.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Action Button */}
          <div className="flex justify-center">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePay}
              className="w-full py-4 px-8 rounded-full bg-[#EEEEEE] hover:bg-[#E0E0E0] active:bg-[#D5D5D5] text-gray-800 font-semibold text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Pay ({feeAmount})</span>
            </button>
          </div>
        </>
      ) : (
        /* Dedicated Bank Transfer Virtual Account Drawer */
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 space-y-3">
            <h3 className="text-sm font-bold text-[#200441]">Dynamic Transfer Details</h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between py-1 border-b border-purple-200/60">
                <span className="text-gray-500">Bank Name:</span>
                <span className="font-semibold text-gray-900">Pearl Microfinance / Wema</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-200/60">
                <span className="text-gray-500">Account Number:</span>
                <span className="font-mono font-bold text-base text-[#200441]">9834 502 119</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-200/60">
                <span className="text-gray-500">Account Name:</span>
                <span className="font-semibold text-gray-900">Pearl Uni - John Offiong</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Expires in:</span>
                <span className="font-mono font-medium text-emerald-600">59 minutes 42 seconds</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setTransferDetailsVisible(false)}
              className="w-1/3 py-3.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmTransfer}
              className="w-2/3 py-3.5 rounded-full bg-[#200441] text-white text-sm font-semibold hover:bg-[#35145D] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <FiCheckCircle className="w-4 h-4" />
              <span>I Have Transferred</span>
            </button>
          </div>
        </div>
      )}
    </BaseModal>
  )
}
