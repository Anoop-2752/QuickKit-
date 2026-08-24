// Verifies a deployed QuickKit build the way a crawler sees it — no browser,
// no dependencies. Point it at a preview or at production:
//
//   npm run verify -- https://quickkit-git-seo-xxxx.vercel.app
//   npm run verify -- https://www.quickkit.dev
//
// Checks the raw HTML only. Anything here that fails would also fail for
// Googlebot, Bing, and link-preview scrapers.
import { categories, allTools } from '../src/data/tools.js'

const base = (process.argv[2] || '').replace(/\/$/, '')
if (!base) {
  console.error('usage: npm run verify -- <deployment-url>')
  process.exit(1)
}
const isProduction = base.includes('quickkit.dev')

let pass = 0
const failures = []
function check(name, ok, detail = '') {
  if (ok) {
    pass++
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
  }
}

async function get(path) {
  const res = await fetch(base + path, { redirect: 'manual' })
  const body = res.status < 300 ? await res.text() : ''
  return { status: res.status, body, location: res.headers.get('location') }
}

const one = (html, re) => (html.match(re) || []).length

// --- every route resolves and is self-canonical -----------------------------
const routes = [
  '/', '/privacy', '/terms', '/cookies',
  ...categories.map((c) => `/${c.slug}`),
  ...allTools.map((t) => `/${t.category}/${t.slug}`),
]

console.log(`verifying ${routes.length} routes at ${base}\n`)

for (const route of routes) {
  const { status, body } = await get(route)
  const label = route

  if (status !== 200) {
    check(label, false, `HTTP ${status}`)
    continue
  }

  const canonical = /rel="canonical" href="([^"]*)"/.exec(body)?.[1]
  check(`${label} single canonical`, one(body, /rel="canonical"/g) === 1)
  check(`${label} single description`, one(body, /name="description"/g) === 1)
  check(`${label} single title`, one(body, /<title/g) === 1)
  check(`${label} has h1`, /<h1/.test(body))
  check(`${label} content prerendered`, !/<div id="root"><\/div>/.test(body))

  // Only production can be expected to carry the production canonical host.
  if (isProduction) {
    check(
      `${label} canonical self-references`,
      canonical === `https://www.quickkit.dev${route}`,
      `got ${canonical}`
    )
  }
}

// --- tool pages carry their structured data ---------------------------------
for (const tool of allTools) {
  const { body } = await get(`/${tool.category}/${tool.slug}`)
  const label = `${tool.category}/${tool.slug}`
  check(`${label} FAQPage schema`, body.includes('"FAQPage"'))
  check(`${label} BreadcrumbList schema`, body.includes('BreadcrumbList'))
  check(`${label} visible FAQ copy`, body.includes('Frequently Asked Questions'))
}

// --- unknown URLs must 404, not soft-404 ------------------------------------
for (const bogus of ['/developer/not-a-real-tool', '/not-a-category', '/a/b/c']) {
  const { status } = await get(bogus)
  check(`${bogus} returns 404`, status === 404, `got ${status}`)
}

// --- sitemap and robots ------------------------------------------------------
const sitemap = await get('/sitemap.xml')
check('sitemap.xml served', sitemap.status === 200)
check(
  'sitemap lists every route',
  routes.every((r) => sitemap.body.includes(`<loc>https://www.quickkit.dev${r}</loc>`))
)
const robots = await get('/robots.txt')
check('robots.txt served', robots.status === 200)
check('robots points at sitemap', robots.body.includes('/sitemap.xml'))

// --- production-only: apex must redirect permanently to www ------------------
if (isProduction) {
  const res = await fetch('https://quickkit.dev/finance/emi-calculator', { redirect: 'manual' })
  check(
    'apex redirects permanently (308/301)',
    res.status === 308 || res.status === 301,
    `got ${res.status} — if 307, change it in Vercel domain settings`
  )
  check(
    'apex redirects to www',
    (res.headers.get('location') || '').startsWith('https://www.quickkit.dev')
  )
}

console.log(`${pass} checks passed`)
if (failures.length) {
  console.log(`\n${failures.length} FAILED:`)
  for (const f of failures.slice(0, 40)) console.log('  ' + f)
  process.exit(1)
}
console.log('\nall checks passed')
