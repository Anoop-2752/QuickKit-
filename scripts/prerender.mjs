// Renders every route to static HTML so crawlers, OG scrapers and no-JS
// visitors get real content and correct per-page metadata. The client then
// hydrates the markup in place.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { categories, allTools } from '../src/data/tools.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')

const { render } = await import(pathToFileURL(resolve(ROOT, 'dist-ssr/entry-server.js')).href)

const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')

// Per-category SEO chunks, loaded once and inlined into the pages that need
// them so the first render has FAQ/How-To content without a second fetch.
const seoByCategory = {}
for (const category of categories) {
  const mod = await import(pathToFileURL(resolve(ROOT, `src/data/seo/${category.slug}.js`)).href)
  seoByCategory[category.slug] = mod.default
}

const routes = [
  { url: '/' },
  { url: '/privacy' },
  { url: '/terms' },
  { url: '/cookies' },
  ...categories.map((c) => ({ url: `/${c.slug}`, category: c.slug })),
  ...allTools.map((t) => ({ url: `/${t.category}/${t.slug}`, category: t.category, tool: t.slug })),
]

function inject(html, { head, body, seo }) {
  const inlineSeo = seo
    ? `\n    <script>window.__QUICKKIT_SEO__=${JSON.stringify(seo).replace(/</g, '\u003c')}</script>`
    : ''
  return html
    .replace('</head>', `  ${head}${inlineSeo}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

let written = 0
for (const route of routes) {
  // Only the tool page consumes preloaded SEO data; category pages have their
  // own static copy and don't need the payload inlined.
  const seo = route.tool ? { [route.category]: { [route.tool]: seoByCategory[route.category][route.tool] } } : null

  const { head, body } = await render(route.url, { seo })
  const html = inject(template, { head, body, seo })

  const outDir = route.url === '/' ? DIST : resolve(DIST, route.url.slice(1))
  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, 'index.html'), html, 'utf8')
  written++
}

// Unmatched URLs get this with a real 404 status instead of a soft 404.
const { head, body } = await render('/__not-found__/__not-found__/__not-found__')
writeFileSync(resolve(DIST, '404.html'), inject(template, { head, body }), 'utf8')

console.log(`prerendered ${written} routes + 404.html`)
