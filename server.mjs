// Tiny zero-dependency preview server for dist/. Not used in production.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { acceptsMarkdown, markdownPath, varyByAccept, markdownTokenEstimate } from './src/negotiation.js'

const DIST = join(dirname(fileURLToPath(import.meta.url)), 'dist')
const PORT = process.env.PORT || 4321
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.json': 'application/json',
}

const server = createServer(async (req, res) => {
  let path
  try { path = decodeURIComponent(new URL(req.url, 'http://x').pathname) }
  catch { return res.writeHead(400).end('Bad URL') }
  const pageMarkdown = ['GET', 'HEAD'].includes(req.method)
    && acceptsMarkdown(req.headers.accept) ? markdownPath(path) : null
  if (pageMarkdown) {
    try {
      const markdown = await readFile(join(DIST, pageMarkdown), 'utf8')
      res.writeHead(200, {
        'content-type': TYPES['.md'],
        vary: varyByAccept(),
        'x-markdown-tokens': String(markdownTokenEstimate(markdown)),
      })
      return res.end(req.method === 'HEAD' ? undefined : markdown)
    } catch { /* Keep the ordinary 404 behavior for unknown pages. */ }
  }
  if (path.endsWith('/')) path += 'index.html'
  if (!extname(path)) path += '/index.html'
  try {
    const buf = await readFile(join(DIST, path))
    const headers = { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }
    if (extname(path) === '.html') headers.vary = varyByAccept()
    res.writeHead(200, headers)
    res.end(req.method === 'HEAD' ? undefined : buf)
  } catch {
    try {
      const buf = await readFile(join(DIST, '404.html'))
      res.writeHead(404, { 'content-type': TYPES['.html'], vary: varyByAccept() })
      res.end(req.method === 'HEAD' ? undefined : buf)
    } catch { res.writeHead(404).end('Not found') }
  }
})
server.listen(PORT, '127.0.0.1', () => console.log(`\n  Preview: http://localhost:${server.address().port}\n`))
