import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { UIProvider } from './context/UIContext'
import { AuthProvider } from './context/AuthContext'
import { LibraryProvider } from './context/LibraryContext'
import { LibraryFilterProvider } from './context/LibraryFilterContext'
import { RootLayout } from './components/layout/RootLayout'
import { HomePage } from './pages/HomePage'
import { AcademicsPage } from './pages/AcademicsPage'
import { AboutPage } from './pages/AboutPage'
import { PortalsPage } from './pages/PortalsPage'
import { LibraryLoginPage } from './pages/LibraryLoginPage'
import { StudentLoginPage } from './pages/StudentLoginPage'
import { LibraryDashboardPage } from './pages/LibraryDashboardPage'
import { LibraryBookDetailsPage } from './pages/LibraryBookDetailsPage'
import { LibraryFacultiesPage } from './pages/LibraryFacultiesPage'
import { LibraryAuthorsPage } from './pages/LibraryAuthorsPage'
import { LibrarySpotlightPage } from './pages/LibrarySpotlightPage'
import { LibrarySavedPage } from './pages/LibrarySavedPage'
import { StudentDashboardPage } from './pages/StudentDashboardPage'
import { AcceptanceFeePaymentPage } from './pages/AcceptanceFeePaymentPage'
import { OnlineScreeningPage } from './pages/OnlineScreeningPage'
import { store } from './store'

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <UIProvider>
          <BrowserRouter>
            <AuthProvider>
              <LibraryProvider>
                <LibraryFilterProvider>
                  <Routes>
                  {/* Standalone Student Dashboard Routes (No public Navbar / Footer) */}
                  <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                  <Route path="/student/dashboard/acceptance-fee" element={<AcceptanceFeePaymentPage />} />
                  <Route path="/student/acceptance-fee" element={<AcceptanceFeePaymentPage />} />
                  <Route path="/student-acceptance-fee" element={<AcceptanceFeePaymentPage />} />
                  <Route path="/student/dashboard/screening" element={<OnlineScreeningPage />} />
                  <Route path="/student/screening" element={<OnlineScreeningPage />} />
                  <Route path="/student-screening" element={<OnlineScreeningPage />} />
                  <Route path="/student/dashboard/*" element={<StudentDashboardPage />} />
                  <Route path="/student-dashboard" element={<StudentDashboardPage />} />

                  {/* Standalone e-Library Functional Screens (No public Navbar / Footer) */}
                  <Route path="/library/dashboard" element={<LibraryDashboardPage />} />
                  <Route path="/library/dashboard/book/:bookId" element={<LibraryBookDetailsPage />} />
                  <Route path="/library/dashboard/catalogue" element={<LibraryDashboardPage />} />
                  <Route path="/library/dashboard/faculties" element={<LibraryFacultiesPage />} />
                  <Route path="/library/dashboard/sections" element={<LibraryFacultiesPage />} />
                  <Route path="/library/dashboard/authors" element={<LibraryAuthorsPage />} />
                  <Route path="/library/dashboard/spotlight" element={<LibrarySpotlightPage />} />
                  <Route path="/library/dashboard/departments" element={<LibrarySpotlightPage />} />
                  <Route path="/library/dashboard/saved" element={<LibrarySavedPage />} />
                  <Route path="/library/dashboard/reads" element={<LibrarySavedPage />} />
                  <Route path="/library/dashboard/settings" element={<LibrarySavedPage />} />
                  <Route path="/library-dashboard" element={<LibraryDashboardPage />} />
                  <Route path="/library/dashboard/*" element={<LibraryDashboardPage />} />

                  {/* Public Website Routes with Standard RootLayout */}
                  <Route path="/" element={<RootLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="academics" element={<AcademicsPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="portals" element={<PortalsPage />} />
                    <Route path="student-portal" element={<StudentLoginPage />} />
                    <Route path="student-login" element={<StudentLoginPage />} />
                    <Route path="portals/student" element={<StudentLoginPage />} />
                    <Route path="portal/student" element={<StudentLoginPage />} />
                    <Route path="library" element={<LibraryLoginPage />} />
                    <Route path="library-login" element={<LibraryLoginPage />} />
                    <Route path="e-library" element={<LibraryLoginPage />} />
                    <Route path="news-and-event" element={<HomePage />} />
                    <Route path="contact" element={<HomePage />} />
                    <Route path="*" element={<HomePage />} />
                  </Route>
                </Routes>
              </LibraryFilterProvider>
            </LibraryProvider>
          </AuthProvider>
        </BrowserRouter>
        </UIProvider>
      </Provider>
    </HelmetProvider>
  )
}

export default App
