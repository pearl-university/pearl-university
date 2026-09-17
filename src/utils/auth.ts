export interface LibraryUser {
  studentId: string
  name: string
  email: string
  program: string
  faculty: string
  department: string
  level: string
  avatarUrl?: string
}

export const DEMO_CREDENTIALS = {
  studentId: 'PU/2024/CSC/0842',
  password: 'Student@123',
  user: {
    studentId: 'PU/2024/CSC/0842',
    name: 'John Offiong',
    email: 'john.offiong@pearl.edu.ng',
    program: 'Undergraduate',
    faculty: 'Computing & Informatics',
    department: 'Computer Science',
    level: '400 Level',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  } as LibraryUser,
}

const ACCEPTED_STUDENT_IDS = [
  'pu/2024/csc/0842',
  'pearl/std/2024/0842',
  'john.offiong@pearl.edu.ng',
  'student@pearl.edu',
  'pu-2024-0842',
]

const AUTH_STORAGE_KEY = 'pearl_library_user'

export const validateLibraryCredentials = (
  studentIdInput: string,
  passwordInput: string
): { success: boolean; user?: LibraryUser; error?: string } => {
  const cleanId = studentIdInput.trim().toLowerCase()
  const cleanPw = passwordInput.trim()

  const isIdValid = ACCEPTED_STUDENT_IDS.includes(cleanId) || cleanId === 'pu/2024/csc/0842'
  const isPasswordValid = cleanPw === DEMO_CREDENTIALS.password

  if (isIdValid && isPasswordValid) {
    return {
      success: true,
      user: DEMO_CREDENTIALS.user,
    }
  }

  if (!isIdValid && !isPasswordValid) {
    return {
      success: false,
      error: 'Invalid Student ID and Password combination.',
    }
  }

  if (!isIdValid) {
    return {
      success: false,
      error: 'Student ID was not found in the university registry.',
    }
  }

  return {
    success: false,
    error: 'Incorrect password. Try Student@123',
  }
}

export const getLibraryUser = (): LibraryUser | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as LibraryUser
  } catch {
    return null
  }
}

export const setLibraryUser = (user: LibraryUser): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  } catch {
    // ignore
  }
}

export const clearLibraryUser = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export const isLibraryAuthenticated = (): boolean => {
  return getLibraryUser() !== null
}
