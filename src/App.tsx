import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { RootLayout } from './components/layout/RootLayout'
import { HomePage } from './pages/HomePage'
import { store } from './store'

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="academics" element={<HomePage />} />
              <Route path="about" element={<HomePage />} />
              <Route path="portals" element={<HomePage />} />
              <Route path="news-and-event" element={<HomePage />} />
              <Route path="contact" element={<HomePage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  )
}

export default App
