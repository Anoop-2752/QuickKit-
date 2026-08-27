// Serves dist/ the way Vercel does, so local checks match production.
//
//   npm run serve:dist
//   npm run verify -- http://127.0.0.1:4173
//
// `vite preview` is not suitable for this: it falls back to index.html for any
// unmatched path, which hides two things we care about — whether a route was
// actually prerendered to its own file, and whether unknown URLs return a real
// 404 instead of a soft 404.
//
// Resolution order mirrors Vercel's static handling:
//   1. the exact file
//   2. <path>/index.html   (our prerendered routes)
//   3. <path>.html
//   4. 404.html with a 404 status
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const DIST = resolve(process.cwd(), 'dist')
const PORT = Number(process.env.PORT) || 4173

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.')
  process.exit(1)
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

function isFile(p) {
  try {
    return statSync(p).isFile()
  } catch {
    return false
  }
}

createServer((req, res) => {
  let url
  try {
    url = decodeURIComponent(req.url.split('?')[0])
  } catch {
    url = req.url.split('?')[0]
  }

  // Refuse traversal outside dist/.
  const target = resolve(DIST, '.' + url)
  if (!target.startsWith(DIST)) {
    res.writeHead(403).end('Forbidden')
    return
  }

  for (const candidate of [target, join(target, 'index.html'), target + '.html']) {
    if (isFile(candidate)) {
      res.writeHead(200, { 'Content-Type': TYPES[extname(candidate)] || 'application/octet-stream' })
      res.end(readFileSync(candidate))
      return
    }
  }

  res.writeHead(404, { 'Content-Type': TYPES['.html'] })
  res.end(isFile(join(DIST, '404.html')) ? readFileSync(join(DIST, '404.html')) : 'Not found')
}).listen(PORT, () => {
  console.log(`serving dist/ at http://127.0.0.1:${PORT} (Vercel-style routing)`)
})
