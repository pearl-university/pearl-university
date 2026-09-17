/* eslint-disable react-refresh/only-export-components */
import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getLibraryUser,
  setLibraryUser as persistUser,
  clearLibraryUser as removeUser,
  DEMO_CREDENTIALS,
  type LibraryUser,
} from '../utils/auth'
import { useUI } from './UIContext'

export interface AuthContextType {
  user: LibraryUser | null
  isAuthenticated: boolean
  login: (user: LibraryUser) => void
  logout: (options?: { skipConfirm?: boolean }) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const { confirm, showLoader, hideLoader, alert } = useUI()

  // Initialize from localStorage or default fallback
  const [user, setUser] = useState<LibraryUser | null>(() => {
    return getLibraryUser() || DEMO_CREDENTIALS.user
  })

  const login = useCallback((newUser: LibraryUser) => {
    persistUser(newUser)
    setUser(newUser)
  }, [])

  const logout = useCallback(
    async (options?: { skipConfirm?: boolean }): Promise<boolean> => {
      if (!options?.skipConfirm) {
        const shouldLogout = await confirm({
          title: 'Sign Out of e-Library?',
          message:
            'Are you sure you want to end your digital library session? Any active reading progress will be saved.',
          variant: 'danger',
          confirmText: 'Sign Out',
          cancelText: 'Stay Logged In',
        })

        if (!shouldLogout) {
          return false
        }
      }

      showLoader('Signing out of Pearl e-Library...')
      await new Promise((resolve) => setTimeout(resolve, 1000))

      removeUser()
      setUser(null)
      hideLoader()

      navigate('/portals')

      setTimeout(() => {
        alert.success(
          'Signed Out Successfully',
          'You have been safely signed out of the e-Library portal.'
        )
      }, 200)

      return true
    },
    [confirm, showLoader, hideLoader, alert, navigate]
  )

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
