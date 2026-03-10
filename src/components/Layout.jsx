import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CookieBanner from './CookieBanner'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <Navbar />
      {/* key re-mounts the wrapper on each route change, triggering the CSS animation */}
      <main id="main-content" key={pathname} className="flex-1 page-enter">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
