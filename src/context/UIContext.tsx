/* eslint-disable react-refresh/only-export-components */
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useState, useCallback, useRef } from 'react'

export type AlertVariant = 'success' | 'error' | 'warning' | 'info'
export type ConfirmVariant = 'primary' | 'danger' | 'warning' | 'info'

export interface AlertItem {
  id: string
  type: AlertVariant
  title: string
  message: string
  duration?: number
}

export interface ConfirmOptions {
  title: string
  message: string
  icon?: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  onConfirm?: () => void
  onCancel?: () => void
}

export interface LoaderState {
  isVisible: boolean
  text: string
}

export interface UIContextType {
  // Loader
  loader: LoaderState
  showLoader: (text?: string) => void
  hideLoader: () => void
  withLoading: <T>(action: () => Promise<T>, text?: string) => Promise<T>

  // Alert / Toast System
  alerts: AlertItem[]
  showAlert: (alert: Omit<AlertItem, 'id'>) => string
  dismissAlert: (id: string) => void
  alert: {
    success: (title: string, message: string, duration?: number) => string
    error: (title: string, message: string, duration?: number) => string
    warning: (title: string, message: string, duration?: number) => string
    info: (title: string, message: string, duration?: number) => string
  }

  // Confirm Modal
  confirmModal: (ConfirmOptions & { isOpen: boolean }) | null
  confirm: (options: ConfirmOptions) => Promise<boolean>
  resolveConfirm: (result: boolean) => void
  closeConfirm: () => void
}

const UIContext = createContext<UIContextType | null>(null)

export const UIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Loader state
  const [loader, setLoader] = useState<LoaderState>({
    isVisible: false,
    text: 'Loading...',
  })

  const showLoader = useCallback((text = 'Loading...') => {
    setLoader({ isVisible: true, text })
  }, [])

  const hideLoader = useCallback(() => {
    setLoader((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const withLoading = useCallback(
    async <T,>(action: () => Promise<T>, text = 'Loading...'): Promise<T> => {
      try {
        showLoader(text)
        return await action()
      } finally {
        hideLoader()
      }
    },
    [showLoader, hideLoader]
  )

  // 2. Alert state
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const showAlert = useCallback(
    ({ type, title, message, duration = 4500 }: Omit<AlertItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newAlert: AlertItem = { id, type, title, message, duration }

      setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]) // Keep up to 5 stacked alerts

      if (duration && duration > 0) {
        setTimeout(() => {
          dismissAlert(id)
        }, duration)
      }

      return id
    },
    [dismissAlert]
  )

  const alertHelper = {
    success: useCallback(
      (title: string, message: string, duration?: number) =>
        showAlert({ type: 'success', title, message, duration }),
      [showAlert]
    ),
    error: useCallback(
      (title: string, message: string, duration?: number) =>
        showAlert({ type: 'error', title, message, duration }),
      [showAlert]
    ),
    warning: useCallback(
      (title: string, message: string, duration?: number) =>
        showAlert({ type: 'warning', title, message, duration }),
      [showAlert]
    ),
    info: useCallback(
      (title: string, message: string, duration?: number) =>
        showAlert({ type: 'info', title, message, duration }),
      [showAlert]
    ),
  }

  // 3. Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<
    (ConfirmOptions & { isOpen: boolean }) | null
  >(null)
  const confirmPromiseResolver = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmPromiseResolver.current = resolve
      setConfirmModal({
        ...options,
        isOpen: true,
      })
    })
  }, [])

  const resolveConfirm = useCallback((result: boolean) => {
    setConfirmModal(null)
    if (confirmPromiseResolver.current) {
      confirmPromiseResolver.current(result)
      confirmPromiseResolver.current = null
    }
  }, [])

  const closeConfirm = useCallback(() => {
    resolveConfirm(false)
  }, [resolveConfirm])

  return (
    <UIContext.Provider
      value={{
        loader,
        showLoader,
        hideLoader,
        withLoading,
        alerts,
        showAlert,
        dismissAlert,
        alert: alertHelper,
        confirmModal,
        confirm,
        resolveConfirm,
        closeConfirm,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export const useUI = (): UIContextType => {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
