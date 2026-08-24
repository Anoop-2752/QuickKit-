import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { AppRoutes } from './App.jsx'
import { setPreloadedSeo } from './data/seo/preload.js'

// React 19 hoists <title>, <meta> and <link> into <head> in the browser, so the
// server has to put them there too or hydration won't line up. Server-side they
// are emitted inline, hence this lift.
//
// JSON-LD scripts are deliberately NOT lifted: React only hoists *async*
// scripts, so on the client they stay where they are rendered, in the body.
// Moving them into <head> here would make the server markup structurally
// different from the client's first render and break hydration. Schema.org
// data is valid anywhere in the document.
const HEAD_TAG = /<title[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*?\/?>|<link\b[^>]*?\/?>/g

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
