import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// gtag('config') in index.html fires a page_view for the initial load, so the
// first route render must not send a second one.
export default function Analytics() {
  const { pathname, search } = useLocation()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    if (typeof window.gtag !== 'function') return

    // Wait a frame so Helmet has flushed the new <title> — gtag reads
    // document.title at send time.
    const frame = requestAnimationFrame(() => {
      window.gtag('event', 'page_view', {
        page_path: pathname + search,
        page_location: window.location.href,
        page_title: document.title,
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, search])

  return null
}
