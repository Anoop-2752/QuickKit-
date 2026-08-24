import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { AppRoutes } from './App.jsx'
import { setPreloadedSeo } from './data/seo/preload.js'

// React 19 hoists <title>/<meta>/<link>/<script type="application/ld+json">
// into <head> in the browser. Server-side they are emitted inline, so we lift
// them out of the body markup and hand them back for the <head> of the file.
const HEAD_TAG = /<title[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*?\/?>|<link\b[^>]*?\/?>|<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g

function extractHead(html) {
  const tags = []
  const body = html.replace(HEAD_TAG, (tag) => {
    tags.push(tag)
    return ''
  })
  return { body, head: tags.join('\n    ') }
}

export async function render(url, { seo } = {}) {
  if (seo) {
    for (const [categorySlug, data] of Object.entries(seo)) {
      setPreloadedSeo(categorySlug, data)
    }
  }

  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <HelmetProvider>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  )

  let html = ''
  for await (const chunk of prelude) html += chunk

  return extractHead(html)
}
