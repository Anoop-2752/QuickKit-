import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy-load every page — each becomes its own JS chunk
const HomePage      = lazy(() => import('./pages/HomePage'))
const CategoryPage  = lazy(() => import('./pages/CategoryPage'))
const ToolPage      = lazy(() => import('./pages/ToolPage'))
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService= lazy(() => import('./pages/TermsOfService'))
const CookiePolicy  = lazy(() => import('./pages/CookiePolicy'))

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="cookies" element={<CookiePolicy />} />
            <Route path=":category" element={<CategoryPage />} />
            <Route path=":category/:tool" element={<ToolPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
