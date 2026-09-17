import type { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from 'react-icons/fi'
import { useUI, type AlertItem } from '../../context/UIContext'

const VARIANT_CONFIGS = {
  success: {
    icon: <FiCheckCircle className="w-5 h-5 text-emerald-600" />,
    badgeBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
    accentBar: 'bg-emerald-500',
    titleColor: 'text-emerald-950',
  },
  error: {
    icon: <FiAlertCircle className="w-5 h-5 text-red-600" />,
    badgeBg: 'bg-red-50 text-red-600 border border-red-200/60',
    accentBar: 'bg-red-500',
    titleColor: 'text-red-950',
  },
  warning: {
    icon: <FiAlertTriangle className="w-5 h-5 text-amber-600" />,
    badgeBg: 'bg-amber-50 text-amber-600 border border-amber-200/60',
    accentBar: 'bg-amber-500',
    titleColor: 'text-amber-950',
  },
  info: {
    icon: <FiInfo className="w-5 h-5 text-[#200441]" />,
    badgeBg: 'bg-[#ECE0EF] text-[#200441] border border-[#200441]/20',
    accentBar: 'bg-[#200441]',
    titleColor: 'text-[#200441]',
  },
}

const AlertToastItem: FC<{ alert: AlertItem; onDismiss: (id: string) => void }> = ({
  alert,
  onDismiss,
}) => {
  const config = VARIANT_CONFIGS[alert.type] || VARIANT_CONFIGS.info

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.94, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 50, scale: 0.9, filter: 'blur(4px)' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden w-full bg-white/95 backdrop-blur-md border border-black/10 rounded-2xl p-4 shadow-xl shadow-black/10 pointer-events-auto flex items-start gap-3.5 group hover:shadow-2xl transition-shadow"
      role="alert"
    >
      {/* Icon Badge */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.badgeBg}`}
      >
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <h4 className={`text-sm sm:text-[15px] font-heading font-medium leading-tight ${config.titleColor}`}>
          {alert.title}
        </h4>
        <p className="text-xs sm:text-[13px] text-gray-600 font-normal leading-relaxed mt-1 line-clamp-3">
          {alert.message}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={() => onDismiss(alert.id)}
        aria-label="Dismiss notification"
        className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-black hover:bg-black/5 transition-all cursor-pointer"
      >
        <FiX className="w-4 h-4" />
      </button>

      {/* Auto-dismiss duration bar */}
      {alert.duration && alert.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: alert.duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-1 ${config.accentBar} opacity-60`}
        />
      )}
    </motion.div>
  )
}

export const AlertToastsContainer: FC = () => {
  const { alerts, dismissAlert } = useUI()

  return (
    <div className="fixed top-5 sm:top-7 right-4 sm:right-8 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-[calc(100%-32px)] sm:w-96 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <AlertToastItem key={alert.id} alert={alert} onDismiss={dismissAlert} />
        ))}
      </AnimatePresence>
    </div>
  )
}
