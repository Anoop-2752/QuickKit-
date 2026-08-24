// Per-category SEO data is code-split into one chunk each, so a tool page
// normally fetches its chunk after mount. Prerendered pages instead inline the
// data they need, letting the first render (server and client) include the FAQ
// and How-To content with no extra round-trip and no hydration mismatch.
const registry = new Map()

export function setPreloadedSeo(categorySlug, data) {
  if (data) registry.set(categorySlug, data)
}

// Returns undefined when the category was never preloaded (caller should fetch
// the chunk), or the tool's entry / null when it was.
export function getPreloadedSeo(categorySlug, toolSlug) {
  if (!registry.has(categorySlug)) return undefined
  return registry.get(categorySlug)[toolSlug] ?? null
}

export function hydratePreloadedSeoFromWindow() {
  if (typeof window === 'undefined') return
  const payload = window.__QUICKKIT_SEO__
  if (!payload) return
  for (const [categorySlug, data] of Object.entries(payload)) {
    setPreloadedSeo(categorySlug, data)
  }
}
