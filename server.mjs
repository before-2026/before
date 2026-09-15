// Tiny zero-dependency preview server for dist/. Not used in production.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = join(dirname(fileURLToPath(import.meta.url)), 'dist')
const PORT = process.env.PORT || 4321
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json',
}

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (path.endsWith('/')) path += 'index.html'
  if (!extname(path)) path += '/index.html'
  try {
    const buf = await readFile(join(DIST, path))
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' })
    res.end(buf)
  } catch {
    try {
      const buf = await readFile(join(DIST, '404.html'))
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
      res.end(buf)
    } catch { res.writeHead(404).end('Not found') }
  }
}).listen(PORT, () => console.log(`\n  Preview: http://localhost:${PORT}\n`))
