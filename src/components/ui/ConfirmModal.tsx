import type { FC, ReactNode } from 'react'
import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiAlertTriangle,
  FiHelpCircle,
  FiTrash2,
  FiInfo,
  FiX,
} from 'react-icons/fi'
import { useUI, type ConfirmVariant } from '../../context/UIContext'

export interface ConfirmModalProps {
  isOpen?: boolean
  title?: string
  message?: string
  icon?: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}

const VARIANT_CONFIGS: Record<
  ConfirmVariant,
  {
    defaultIcon: ReactNode
    iconBg: string
    iconColor: string
    confirmBtnClass: string
    accentBadge: string
  }
> = {
  primary: {
    defaultIcon: <FiHelpCircle className="w-6 h-6" />,
    iconBg: 'bg-[#ECE0EF]',
    iconColor: 'text-[#200441]',
    confirmBtnClass:
      'bg-[#200441] hover:bg-[#2e065e] text-white focus:ring-[#200441]/40 shadow-lg shadow-[#200441]/20',
    accentBadge: 'border-[#200441]/20',
  },
  danger: {
    defaultIcon: <FiTrash2 className="w-6 h-6" />,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    confirmBtnClass:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600/40 shadow-lg shadow-red-600/20',
    accentBadge: 'border-red-200',
  },
  warning: {
    defaultIcon: <FiAlertTriangle className="w-6 h-6" />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    confirmBtnClass:
      'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-600/40 shadow-lg shadow-amber-600/20',
    accentBadge: 'border-amber-200',
  },
  info: {
    defaultIcon: <FiInfo className="w-6 h-6" />,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    confirmBtnClass:
      'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600/40 shadow-lg shadow-blue-600/20',
    accentBadge: 'border-blue-200',
  },
}

export const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const uiContext = useUI()

  // Use props if provided directly, otherwise fallback to UIContext state
  const isContextControlled = props.isOpen === undefined
  const isOpen = isContextControlled
    ? Boolean(uiContext.confirmModal?.isOpen)
    : Boolean(props.isOpen)

  const activeData = isContextControlled ? uiContext.confirmModal : props
  const variant: ConfirmVariant = activeData?.variant || 'primary'
  const config = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.primary

  const handleConfirm = useCallback(() => {
    if (activeData?.onConfirm) {
      activeData.onConfirm()
    }
    if (isContextControlled) {
      uiContext.resolveConfirm(true)
    } else {
      props.onClose?.()
    }
  }, [activeData, isContextControlled, uiContext, props])

  const handleCancel = useCallback(() => {
    if (activeData?.onCancel) {
      activeData.onCancel()
    }
    if (isContextControlled) {
      uiContext.resolveConfirm(false)
    } else {
      props.onClose?.()
    }
  }, [activeData, isContextControlled, uiContext, props])

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, handleCancel])

  return (
    <AnimatePresence>
      {isOpen && activeData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/10 overflow-hidden z-10"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-desc"
          >
            {/* Close icon button */}
            <button
              type="button"
              onClick={handleCancel}
              aria-label="Close dialog"
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-black hover:bg-black/5 transition-all cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Header & Icon */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${config.iconBg} ${config.iconColor} border ${config.accentBadge}`}
              >
                {activeData.icon || config.defaultIcon}
              </div>
              <div className="flex-1">
                <h3
                  id="confirm-modal-title"
                  className="font-heading text-xl sm:text-2xl font-medium text-gray-950 leading-tight"
                >
                  {activeData.title || 'Confirm Action'}
                </h3>
                <span className="inline-block mt-0.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold">
                  Verification Required
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-3 text-sm sm:text-[15px] text-gray-600 font-normal leading-relaxed border-t border-gray-100 pt-4">
              <p id="confirm-modal-desc">{activeData.message}</p>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer text-center"
              >
                {activeData.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-medium text-sm transition-all focus:outline-none focus:ring-2 cursor-pointer text-center ${config.confirmBtnClass}`}
              >
                {activeData.confirmText || 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
