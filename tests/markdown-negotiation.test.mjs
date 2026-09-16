import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { handleRequest } from '../edge/markdown-negotiation.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')
const domain = 'https://beforeubereats.com'

async function originFetch(request) {
  const path = new URL(request.url).pathname
  const file = path === '/' ? 'index.html' : path.slice(1)
  try {
    const body = await readFile(join(dist, file))
    return new Response(body, {
      status: 200,
      headers: {
        'content-type': file.endsWith('.md') ? 'text/plain' : 'text/html; charset=utf-8',
        'content-length': String(body.length),
        vary: 'Accept-Encoding',
        etag: '"html-etag"',
      },
    })
  } catch {
    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/html' } })
  }
}

test('generated page Markdown retains the price and numbered original sources without layout', async () => {
  const html = await readFile(join(dist, 'index.html'), 'utf8')
  const markdown = await readFile(join(dist, 'index.md'), 'utf8')
  assert.match(markdown, /^---\ntitle: /)
  assert.match(markdown, /\*\*Menu price:\*\* A\$12/)
  assert.match(markdown, /\*\*Lowest selectable item price:\*\* A\$16/)
  assert.match(markdown, /\[1\]/)
  assert.match(markdown, /## Sources[\s\S]*https:\/\/www\.ubereats\.com\/store\//)
  assert.doesNotMatch(markdown, /<(?:nav|footer|header|style)\b/i)
  assert.doesNotMatch(markdown, /You are not on an Uber website/)
  assert.ok(markdown.length < html.length / 2)
})

test('Worker negotiates Markdown for the same page URL and leaves HTML default', async () => {
  const markdown = await handleRequest(new Request(`${domain}/`, {
    headers: { accept: 'text/markdown' },
  }), originFetch)
  assert.equal(markdown.status, 200)
  assert.match(markdown.headers.get('content-type'), /^text\/markdown/)
  assert.equal(markdown.headers.get('vary'), 'Accept-Encoding, Accept')
  assert.ok(Number(markdown.headers.get('x-markdown-tokens')) > 0)
  assert.equal(markdown.headers.get('content-length'), null)
  assert.equal(markdown.headers.get('etag'), null)
  assert.match(await markdown.text(), /Lowest selectable item price/)

  const html = await handleRequest(new Request(`${domain}/`), originFetch)
  assert.match(html.headers.get('content-type'), /^text\/html/)
  assert.equal(html.headers.get('vary'), 'Accept-Encoding, Accept')
  assert.match(await html.text(), /<html\b/)
})

test('nested pages, quality zero, assets, missing pages, HEAD, and conditional requests', async () => {
  const nested = await handleRequest(new Request(`${domain}/the-price/`, {
    headers: { accept: 'text/html;q=0.5, text/markdown;q=0.8' },
  }), originFetch)
  assert.match(await nested.text(), /\*\*Menu price:\*\* \$12/)

  const denied = await handleRequest(new Request(`${domain}/`, {
    headers: { accept: 'text/markdown;q=0' },
  }), originFetch)
  assert.match(denied.headers.get('content-type'), /^text\/html/)

  const prefersHtml = await handleRequest(new Request(`${domain}/`, {
    headers: { accept: 'text/html, text/markdown;q=0.8' },
  }), originFetch)
  assert.match(prefersHtml.headers.get('content-type'), /^text\/html/)

  const assets = await handleRequest(new Request(`${domain}/styles.css`, {
    headers: { accept: 'text/markdown' },
  }), originFetch)
  assert.equal(assets.headers.get('vary'), 'Accept-Encoding')

  const missing = await handleRequest(new Request(`${domain}/missing/`, {
    headers: { accept: 'text/markdown' },
  }), originFetch)
  assert.equal(missing.status, 404)
  assert.match(missing.headers.get('content-type'), /^text\/html/)

  const head = await handleRequest(new Request(`${domain}/`, {
    method: 'HEAD', headers: { accept: 'text/markdown' },
  }), originFetch)
  assert.equal(await head.text(), '')
  assert.match(head.headers.get('content-type'), /^text\/markdown/)

  const conditional = await handleRequest(new Request(`${domain}/`, {
    headers: { accept: 'text/markdown', 'if-none-match': '"html-etag"' },
  }), async (request) => {
    assert.equal(request.headers.get('if-none-match'), null)
    return originFetch(request)
  })
  assert.equal(conditional.status, 200)
})

test('local preview negotiates on a page URL and preserves browser HTML', async (t) => {
  const child = spawn(process.execPath, ['server.mjs'], {
    cwd: root, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'],
  })
  t.after(() => child.kill())
  const address = await new Promise((resolve, reject) => {
    let output = ''
    const timer = setTimeout(() => reject(new Error('Preview did not start')), 5000)
    child.once('exit', (code) => { clearTimeout(timer); reject(new Error(`Preview exited ${code}: ${output}`)) })
    child.stdout.on('data', (chunk) => {
      output += chunk
      const match = output.match(/http:\/\/localhost:(\d+)/)
      if (match) { clearTimeout(timer); resolve(`http://localhost:${match[1]}`) }
    })
    child.stderr.on('data', (chunk) => { output += chunk })
  })
  const markdown = await fetch(`${address}/the-price/`, { headers: { accept: 'text/markdown' } })
  assert.match(markdown.headers.get('content-type'), /^text\/markdown/)
  assert.match(markdown.headers.get('vary'), /Accept/)
  assert.match(await markdown.text(), /Lowest selectable item price/)
  const html = await fetch(`${address}/the-price/`)
  assert.match(html.headers.get('content-type'), /^text\/html/)
  assert.match(await html.text(), /<html\b/)
})
