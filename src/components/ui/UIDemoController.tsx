import type { FC } from 'react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlay,
  FiPause,
  FiBell,
  FiLoader,
  FiCheckSquare,
  FiChevronUp,
  FiChevronDown,
  FiZap,
} from 'react-icons/fi'
import { useUI, type AlertVariant, type ConfirmVariant } from '../../context/UIContext'

const DEMO_ALERTS: Array<{
  type: AlertVariant
  title: string
  message: string
}> = [
  {
    type: 'success',
    title: 'Application Submitted',
    message: 'Your admission dossier for Faculty of Computing has been verified and registered.',
  },
  {
    type: 'info',
    title: 'Library Sync Complete',
    message: '42 new research papers on Quantum Information have been added to your bookshelf.',
  },
  {
    type: 'warning',
    title: 'Tuition Deadline Approaching',
    message: 'Semester billing portal closes in 48 hours. Please review pending clearance items.',
  },
  {
    type: 'error',
    title: 'Authentication Timeout',
    message: 'Portal session token has expired. Re-authenticate via the library SSO gateway.',
  },
]

const DEMO_LOADERS = [
  'Synchronizing library catalog & digital repositories...',
  'Compiling student course registration ledger...',
  'Connecting to secure Pearl biometric gateway...',
  'Verifying faculty credentials with registrar...',
]

const DEMO_CONFIRMS: Array<{
  title: string
  message: string
  variant: ConfirmVariant
  confirmText: string
  cancelText: string
}> = [
  {
    title: 'Confirm Course Enrollment',
    message:
      'Are you sure you want to register for CSC 401: Advanced Neural Architectures (4 Credits)? This action will update your academic transcript.',
    variant: 'primary',
    confirmText: 'Confirm Enrollment',
    cancelText: 'Review Later',
  },
  {
    title: 'Purge Temporary Workspace?',
    message:
      'This will remove all unsaved draft submissions from your local cache. This action cannot be reversed.',
    variant: 'danger',
    confirmText: 'Purge All Drafts',
    cancelText: 'Keep Data',
  },
  {
    title: 'Override Prerequisite Notice',
    message:
      'You are applying for an accelerated honours thesis without completing STAT 202. Proceed with advisory flag?',
    variant: 'warning',
    confirmText: 'Proceed Anyway',
    cancelText: 'Cancel Application',
  },
  {
    title: 'Download Archived Transcripts',
    message:
      'Generate an encrypted PDF copy of your semester grades signed with Pearl University cryptographic seal?',
    variant: 'info',
    confirmText: 'Generate & Download',
    cancelText: 'Dismiss',
  },
]

export const UIDemoController: FC = () => {
  const { showLoader, hideLoader, alert, confirm } = useUI()
  const [isAutoLooping, setIsAutoLooping] = useState(true)
  const [isPanelExpanded, setIsPanelExpanded] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runStep = useCallback(
    (step: number) => {
      const mode = step % 3
      const cycle = Math.floor(step / 3)

      if (mode === 0) {
        // 1. Show Alert Toast
        const alertData = DEMO_ALERTS[cycle % DEMO_ALERTS.length]
        alert[alertData.type](alertData.title, alertData.message, 4500)
      } else if (mode === 1) {
        // 2. Show Bottom Pill Loader
        const loaderText = DEMO_LOADERS[cycle % DEMO_LOADERS.length]
        showLoader(loaderText)
        setTimeout(() => {
          hideLoader()
        }, 2600)
      } else if (mode === 2) {
        // 3. Show Confirm Modal
        const confirmData = DEMO_CONFIRMS[cycle % DEMO_CONFIRMS.length]
        confirm({
          title: confirmData.title,
          message: confirmData.message,
          variant: confirmData.variant,
          confirmText: confirmData.confirmText,
          cancelText: confirmData.cancelText,
        }).then((confirmed) => {
          if (confirmed) {
            alert.success('Action Confirmed', 'Your choice was registered successfully.')
          }
        })
      }
    },
    [alert, showLoader, hideLoader, confirm]
  )

  useEffect(() => {
    if (!isAutoLooping) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    const intervalTime = 4000 // 4 seconds interval between cyclical triggers

    timerRef.current = setTimeout(() => {
      runStep(stepIndex)
      setStepIndex((prev) => prev + 1)
    }, intervalTime)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isAutoLooping, stepIndex, runStep])

  return (
    <div className="fixed bottom-6 left-6 z-[9000] font-sans">
      <motion.div
        layout
        className="bg-[#141416]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 text-white overflow-hidden p-3.5 sm:p-4 max-w-xs sm:max-w-sm"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isAutoLooping ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isAutoLooping ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="text-xs font-heading font-medium tracking-wide text-white">
              UI System Showcase
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Play / Pause auto interval */}
            <button
              type="button"
              onClick={() => setIsAutoLooping(!isAutoLooping)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs flex items-center gap-1 cursor-pointer"
              title={isAutoLooping ? 'Pause recurring interval' : 'Resume recurring interval'}
            >
              {isAutoLooping ? (
                <>
                  <FiPause className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-[11px] text-gray-300 hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <FiPlay className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-gray-300 hidden sm:inline">Resume</span>
                </>
              )}
            </button>

            {/* Expand / Collapse manual test palette */}
            <button
              type="button"
              onClick={() => setIsPanelExpanded(!isPanelExpanded)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
              title="Toggle interactive controls"
            >
              {isPanelExpanded ? (
                <FiChevronDown className="w-3.5 h-3.5 text-gray-300" />
              ) : (
                <FiChevronUp className="w-3.5 h-3.5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Sub-label showing next trigger */}
        <p className="text-[11px] text-gray-400 mt-1.5 leading-snug">
          {isAutoLooping
            ? `Cycling demo elements automatically every 4s (Step #${stepIndex + 1})`
            : 'Interval paused. Click test triggers below or resume interval.'}
        </p>

        {/* Expandable Manual Test Palette */}
        <AnimatePresence>
          {isPanelExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2.5 overflow-hidden"
            >
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#FDE88C] font-semibold flex items-center gap-1.5">
                <FiZap className="w-3 h-3" /> Manual Triggers
              </div>

              {/* Loader Trigger */}
              <button
                type="button"
                onClick={() => {
                  showLoader('Manual test: Fetching academic archives...')
                  setTimeout(hideLoader, 2500)
                }}
                className="w-full text-left text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition flex items-center gap-2 text-gray-200 cursor-pointer"
              >
                <FiLoader className="w-3.5 h-3.5 text-[#FDE88C] animate-spin" />
                <span>Trigger Bottom Pill Loader</span>
              </button>

              {/* Alert Triggers */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    alert.success('Action Successful', 'Record saved to database.', 4000)
                  }
                  className="text-xs bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 px-2.5 py-1.5 rounded-lg transition text-emerald-300 cursor-pointer flex items-center gap-1.5"
                >
                  <FiBell className="w-3 h-3" /> Success Toast
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert.error('Connection Failed', 'Server response timed out.', 4000)
                  }
                  className="text-xs bg-red-950/60 border border-red-500/30 hover:bg-red-900/60 px-2.5 py-1.5 rounded-lg transition text-red-300 cursor-pointer flex items-center gap-1.5"
                >
                  <FiBell className="w-3 h-3" /> Error Toast
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert.warning('Warning Notice', 'File size exceeds 25MB limit.', 4000)
                  }
                  className="text-xs bg-amber-950/60 border border-amber-500/30 hover:bg-amber-900/60 px-2.5 py-1.5 rounded-lg transition text-amber-300 cursor-pointer flex items-center gap-1.5"
                >
                  <FiBell className="w-3 h-3" /> Warning Toast
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert.info('Portal Info', 'System maintenance tonight at 2AM.', 4000)
                  }
                  className="text-xs bg-purple-950/60 border border-purple-500/30 hover:bg-purple-900/60 px-2.5 py-1.5 rounded-lg transition text-purple-200 cursor-pointer flex items-center gap-1.5"
                >
                  <FiBell className="w-3 h-3" /> Info Toast
                </button>
              </div>

              {/* Confirm Triggers */}
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() =>
                    confirm({
                      title: 'Enroll in Honours Track?',
                      message: 'Confirming will register you for advanced faculty research mentoring.',
                      variant: 'primary',
                      confirmText: 'Confirm Enrollment',
                      cancelText: 'Cancel',
                    })
                  }
                  className="text-xs bg-[#200441] border border-white/20 hover:bg-[#2e065e] px-2.5 py-1.5 rounded-lg transition text-white cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheckSquare className="w-3 h-3 text-[#FDE88C]" /> Confirm Modal (Primary)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    confirm({
                      title: 'Delete Student Record?',
                      message: 'This will permanently erase all local session caches and cookies.',
                      variant: 'danger',
                      confirmText: 'Delete Permanently',
                      cancelText: 'Cancel',
                    })
                  }
                  className="text-xs bg-red-900/60 border border-red-500/30 hover:bg-red-800/60 px-2.5 py-1.5 rounded-lg transition text-red-200 cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheckSquare className="w-3 h-3 text-red-400" /> Confirm Modal (Danger)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
