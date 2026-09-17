/* eslint-disable react-refresh/only-export-components */
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useState, useMemo } from 'react'
import {
  LOCAL_BOOKS_LIBRARY,
  getUniqueFaculties,
  getUniqueDepartments,
  getUniqueCoreAreas,
  filterBooks,
  type BookMetadata,
} from '../utils/bookScanner'

export interface LibraryFilterContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedFaculty: string
  setSelectedFaculty: (fac: string) => void
  selectedDept: string
  setSelectedDept: (dept: string) => void
  selectedCoreArea: string
  setSelectedCoreArea: (area: string) => void
  selectedProgram: string
  setSelectedProgram: (prog: string) => void

  availableFaculties: string[]
  availableDepartments: string[]
  availableCoreAreas: string[]

  filteredBooks: BookMetadata[]
  allBooks: BookMetadata[]
  totalBooksCount: number
}

const LibraryFilterContext = createContext<LibraryFilterContextType | null>(null)

export const LibraryFilterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('All Faculties')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [selectedCoreArea, setSelectedCoreArea] = useState('All Areas')
  const [selectedProgram, setSelectedProgram] = useState('Undergraduate')

  const availableFaculties = useMemo(() => {
    return ['All Faculties', ...getUniqueFaculties()]
  }, [])

  const availableDepartments = useMemo(() => {
    return ['All Departments', ...getUniqueDepartments(selectedFaculty)]
  }, [selectedFaculty])

  const availableCoreAreas = useMemo(() => {
    return ['All Areas', ...getUniqueCoreAreas(selectedFaculty, selectedDept)]
  }, [selectedFaculty, selectedDept])

  const handleFacultyChange = (fac: string) => {
    setSelectedFaculty(fac)
    setSelectedDept('All Departments')
    setSelectedCoreArea('All Areas')
  }

  const handleDeptChange = (dept: string) => {
    setSelectedDept(dept)
    setSelectedCoreArea('All Areas')
  }

  const filteredBooks = useMemo(() => {
    return filterBooks({
      faculty: selectedFaculty,
      department: selectedDept,
      coreArea: selectedCoreArea,
      searchQuery,
    })
  }, [selectedFaculty, selectedDept, selectedCoreArea, searchQuery])

  return (
    <LibraryFilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedFaculty,
        setSelectedFaculty: handleFacultyChange,
        selectedDept,
        setSelectedDept: handleDeptChange,
        selectedCoreArea,
        setSelectedCoreArea,
        selectedProgram,
        setSelectedProgram,
        availableFaculties,
        availableDepartments,
        availableCoreAreas,
        filteredBooks,
        allBooks: LOCAL_BOOKS_LIBRARY,
        totalBooksCount: LOCAL_BOOKS_LIBRARY.length,
      }}
    >
      {children}
    </LibraryFilterContext.Provider>
  )
}

export const useLibraryFilter = (): LibraryFilterContextType => {
  const context = useContext(LibraryFilterContext)
  if (!context) {
    throw new Error('useLibraryFilter must be used within a LibraryFilterProvider')
  }
  return context
}
