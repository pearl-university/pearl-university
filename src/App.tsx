import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { UIProvider } from './context/UIContext'
import { AuthProvider } from './context/AuthContext'
import { LibraryFilterProvider } from './context/LibraryFilterContext'
import { RootLayout } from './components/layout/RootLayout'
import { HomePage } from './pages/HomePage'
import { AcademicsPage } from './pages/AcademicsPage'
import { AboutPage } from './pages/AboutPage'
import { PortalsPage } from './pages/PortalsPage'
import { LibraryLoginPage } from './pages/LibraryLoginPage'
import { LibraryDashboardPage } from './pages/LibraryDashboardPage'
import { store } from './store'

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <UIProvider>
          <BrowserRouter>
            <AuthProvider>
              <LibraryFilterProvider>
                <Routes>
                  {/* Standalone Library Dashboard Routes (No public Navbar / Footer) */}
                  <Route path="/library/dashboard" element={<LibraryDashboardPage />} />
                  <Route path="/library/dashboard/*" element={<LibraryDashboardPage />} />
                  <Route path="/library-dashboard" element={<LibraryDashboardPage />} />

                  {/* Public Website Routes with Standard RootLayout */}
                  <Route path="/" element={<RootLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="academics" element={<AcademicsPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="portals" element={<PortalsPage />} />
                    <Route path="library" element={<LibraryLoginPage />} />
                    <Route path="library-login" element={<LibraryLoginPage />} />
                    <Route path="e-library" element={<LibraryLoginPage />} />
                    <Route path="news-and-event" element={<HomePage />} />
                    <Route path="contact" element={<HomePage />} />
                    <Route path="*" element={<HomePage />} />
                  </Route>
                </Routes>
              </LibraryFilterProvider>
            </AuthProvider>
          </BrowserRouter>
        </UIProvider>
      </Provider>
    </HelmetProvider>
  )
}

export default App
