// Generates public/sitemap.xml from src/data/tools.js so it can never drift
// from the actual tool list. Run as part of `npm run build`.
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { categories, allTools } from '../src/data/tools.js'

const BASE_URL = 'https://www.quickkit.dev'
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const STATIC_PAGES = [
  { path: '/',         changefreq: 'weekly', priority: '1.0', source: 'src/data/tools.js' },
  { path: '/privacy',  changefreq: 'yearly', priority: '0.3', source: 'src/pages/PrivacyPolicy.jsx' },
  { path: '/terms',    changefreq: 'yearly', priority: '0.3', source: 'src/pages/TermsOfService.jsx' },
  { path: '/cookies',  changefreq: 'yearly', priority: '0.3', source: 'src/pages/CookiePolicy.jsx' },
]

const today = new Date().toISOString().slice(0, 10)

// Last commit date (YYYY-MM-DD) that touched a file — a truthful <lastmod>,
// rather than stamping every URL with the build date on each deploy.
const lastmodCache = new Map()
function lastmod(...files) {
  const dates = files.map((file) => {
    if (!lastmodCache.has(file)) {
      let date = ''
      try {
        date = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
          cwd: ROOT,
          encoding: 'utf8',
        }).trim()
      } catch {
        date = ''
      }
      lastmodCache.set(file, date || today)
    }
    return lastmodCache.get(file)
  })
  return dates.sort().at(-1)
}

function urlEntry({ path, changefreq, priority, lastmod: mod }) {
  return [
    '  <url>',
    `    <loc>${BASE_URL}${path}</loc>`,
    `    <lastmod>${mod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

const entries = []

entries.push('  <!-- Static pages -->')
for (const page of STATIC_PAGES) {
  entries.push(urlEntry({ ...page, lastmod: lastmod(page.source) }))
}

entries.push('')
entries.push('  <!-- Category pages -->')
for (const category of categories) {
  entries.push(
    urlEntry({
      path: `/${category.slug}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: lastmod('src/data/tools.js', `src/data/seo/${category.slug}.js`),
    })
  )
}

entries.push('')
entries.push('  <!-- Tool pages -->')
for (const tool of allTools) {
  entries.push(
    urlEntry({
      path: `/${tool.category}/${tool.slug}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: lastmod('src/data/tools.js', `src/data/seo/${tool.category}.js`),
    })
  )
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '',
  ...entries,
  '',
  '</urlset>',
  '',
].join('\n')

writeFileSync(resolve(ROOT, 'public/sitemap.xml'), xml, 'utf8')

const total = STATIC_PAGES.length + categories.length + allTools.length
console.log(`sitemap.xml — ${total} URLs (${allTools.length} tools, ${categories.length} categories)`)
