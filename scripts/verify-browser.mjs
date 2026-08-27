// Loads real pages in a real browser and fails on hydration errors or
// duplicated metadata — the class of bug that HTML-only checks cannot see.
//
//   npm run verify:browser -- http://127.0.0.1:4173
//   npm run verify:browser -- https://www.quickkit.dev
//
// Uses playwright-core against a browser already installed on this machine
// (Edge or Chrome), so `npm install` never downloads a browser.
//
// Why this exists: a Suspense/JSON-LD placement mismatch once caused React
// error #418 on every tool page. Hydration silently fell back to client
// rendering, which appended a SECOND canonical and description to each page —
// invisible in the served HTML, visible only in a browser. Guard it here.
import { existsSync } from 'node:fs'
import { chromium } from 'playwright-core'

const base = (process.argv[2] || '').replace(/\/$/, '')
if (!base) {
  console.error('usage: npm run verify:browser -- <base-url>')
  process.exit(1)
}

const BROWSER_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]

const executablePath =
  process.env.BROWSER_PATH || BROWSER_CANDIDATES.find((p) => existsSync(p))

if (!executablePath) {
  console.error('No Chrome or Edge found. Set BROWSER_PATH to a browser executable.')
  process.exit(1)
}

// One page per route shape: home, category, a tool from each risky category,
// and a static page. Enough to catch structural hydration problems without
// booting a browser 71 times.
const PAGES = [
  '/',
  '/us/paycheck-calculator',
  '/us',
  '/finance/emi-calculator',
  '/developer/json-formatter',
  '/hr/salary-slip-generator',
  '/pdf/pdf-merger',
  '/seo',
  '/privacy',
]

// Noise from analytics and offline asset fetches is not a page defect.
const IGNORE = /gtag|googletagmanager|google-analytics|ERR_|net::|favicon|Failed to load resource/i

const browser = await chromium.launch({ executablePath, headless: true })
let failed = 0

for (const path of PAGES) {
  const page = await browser.newPage()
  const problems = []

  page.on('console', (m) => {
    if (m.type() === 'error' && !IGNORE.test(m.text())) {
      problems.push(`console: ${m.text().slice(0, 180)}`)
    }
  })
  page.on('pageerror', (e) => {
    const text = String(e)
    if (!IGNORE.test(text)) problems.push(`pageerror: ${text.slice(0, 180)}`)
  })

  try {
    await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(600)

    const info = await page.evaluate(() => ({
      canonicals: document.querySelectorAll('link[rel=canonical]').length,
      descriptions: document.querySelectorAll('meta[name=description]').length,
      titles: document.querySelectorAll('title').length,
      h1: document.querySelector('h1')?.textContent?.trim() ?? null,
      mounted: document.getElementById('root')?.childElementCount ?? 0,
    }))

    if (info.canonicals !== 1) problems.push(`${info.canonicals} canonical tags after hydration`)
    if (info.descriptions !== 1) problems.push(`${info.descriptions} description tags after hydration`)
    if (info.titles !== 1) problems.push(`${info.titles} title tags after hydration`)
    if (!info.h1) problems.push('no <h1> rendered')
    if (info.mounted === 0) problems.push('React did not mount')

    const ok = problems.length === 0
    if (!ok) failed++
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${path.padEnd(28)} h1="${info.h1 ?? '-'}"`)
    problems.forEach((p) => console.log('       ' + p))
  } catch (err) {
    failed++
    console.log(`FAIL ${path.padEnd(28)} ${String(err).slice(0, 140)}`)
  }

  await page.close()
}

await browser.close()

console.log(
  failed
    ? `\n${failed} page(s) with problems`
    : '\nno hydration errors, no duplicate metadata'
)
process.exit(failed ? 1 : 0)
