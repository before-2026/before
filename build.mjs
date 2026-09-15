// Static site generator for beforeubereats.com
// Zero dependencies. Node 20+. Emits fully static HTML into dist/.
import { mkdir, writeFile, readFile, rm, cp, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const SRC = join(ROOT, 'src')
const OUT = join(ROOT, 'dist')
const CHECK_ONLY = process.argv.includes('--check')

const { site } = await import('./src/data/site.js')
const { SOURCES } = await import('./src/data/sources.js')
const { layout } = await import('./src/templates/layout.js')

const PAGE_FILES = (await readdir(join(SRC, 'pages')))
  .filter((f) => f.endsWith('.js') && !f.startsWith('zz-'))
  .sort()

const pages = []
for (const file of PAGE_FILES) {
  const mod = await import(join(SRC, 'pages', file))
  if (!mod.page) throw new Error(`src/pages/${file} does not export "page"`)
  pages.push(mod.page)
}
pages.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

// ---------------------------------------------------------------------------
// Validation: every cite key must exist, every source must be reachable-shaped,
// and no page may reference a nav slug that does not exist.
// ---------------------------------------------------------------------------
const errors = []
const warnings = []
const slugs = new Set(pages.map((p) => p.slug))
const usedSources = new Set()

for (const [key, s] of Object.entries(SOURCES)) {
  if (!s.title) errors.push(`source "${key}" has no title`)
  if (!s.url) errors.push(`source "${key}" has no url`)
  else if (!/^https?:\/\//.test(s.url)) errors.push(`source "${key}" url is not absolute: ${s.url}`)
  if (!s.publisher) warnings.push(`source "${key}" has no publisher`)
}

for (const item of site.nav) {
  if (item.slug !== '' && !slugs.has(item.slug)) errors.push(`nav points at missing page "${item.slug}"`)
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
/** Per-page citation collector. Returns numbered superscript links. */
function makeCiter(pageSlug) {
  const order = []
  const seen = new Map()
  let occurrence = 0
  const cite = (...keys) => {
    const parts = keys.map((key) => {
      if (!SOURCES[key]) {
        errors.push(`page "${pageSlug}" cites unknown source "${key}"`)
        return ''
      }
      usedSources.add(key)
      if (!seen.has(key)) {
        order.push(key)
        seen.set(key, order.length)
      }
      const n = seen.get(key)
      return `<a class="cite" href="#ref-${n}" id="cite-${n}-${++occurrence}" aria-label="Source ${n}: ${esc(SOURCES[key].publisher || SOURCES[key].title)}">${n}</a>`
    })
    return `<sup class="cites">${parts.join('<span class="cite-sep">,</span>')}</sup>`
  }
  cite.list = () => order.map((k) => ({ key: k, ...SOURCES[k] }))
  cite.count = () => order.length
  return cite
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const rendered = []
for (const page of pages) {
  const cite = makeCiter(page.slug)
  const ctx = { cite, site, pages, page, SOURCES, esc }
  let body
  try {
    body = await page.render(ctx)
  } catch (e) {
    errors.push(`page "${page.slug}" failed to render: ${e.message}\n${e.stack}`)
    continue
  }
  const html = layout({ ...ctx, body, references: cite.list() })
  rendered.push({ page, html })
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
if (warnings.length) {
  console.warn('\n  Warnings:')
  for (const w of warnings) console.warn('   ! ' + w)
}
if (errors.length) {
  console.error('\n  Build failed:')
  for (const e of errors) console.error('   x ' + e)
  process.exit(1)
}

const unused = Object.keys(SOURCES).filter((k) => !usedSources.has(k))
if (unused.length) console.warn(`\n  Note: ${unused.length} source(s) defined but never cited: ${unused.join(', ')}`)

if (CHECK_ONLY) {
  console.log(`\n  OK — ${pages.length} pages, ${Object.keys(SOURCES).length} sources, ${usedSources.size} cited.\n`)
  process.exit(0)
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------
if (existsSync(OUT)) await rm(OUT, { recursive: true })
await mkdir(OUT, { recursive: true })

for (const { page, html } of rendered) {
  // 404 must sit at the root as 404.html for GitHub Pages to serve it.
  const outPath =
    page.slug === '' ? join(OUT, 'index.html')
    : page.slug === '404' ? join(OUT, '404.html')
    : join(OUT, page.slug, 'index.html')
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html, 'utf8')
}

// Static assets
await cp(join(SRC, 'assets'), OUT, { recursive: true })

// GitHub Pages: skip Jekyll processing so files starting with _ are served
await writeFile(join(OUT, '.nojekyll'), '', 'utf8')

// Custom domain
if (existsSync(join(ROOT, 'CNAME'))) await cp(join(ROOT, 'CNAME'), join(OUT, 'CNAME'))

// robots.txt + sitemap
const origin = site.origin.replace(/\/$/, '')
await writeFile(
  join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
  'utf8'
)
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages
    .map(
      (p) =>
        `  <url><loc>${origin}/${p.slug ? p.slug + '/' : ''}</loc><lastmod>${site.updated}</lastmod><priority>${p.slug === '' ? '1.0' : '0.7'}</priority></url>`
    )
    .join('\n') +
  `\n</urlset>\n`
await writeFile(join(OUT, 'sitemap.xml'), sitemap, 'utf8')

// 404
const notFound = rendered.find((r) => r.page.slug === '404')
if (!notFound) {
  const cite = makeCiter('404')
  const body = `<article class="prose narrow"><h1>Page not found</h1><p class="lede">That page isn't here. It may have been renamed.</p><p><a class="btn" href="/">Back to the start</a></p></article>`
  await writeFile(
    join(OUT, '404.html'),
    layout({ site, pages, page: { slug: '404', title: 'Page not found', description: 'Page not found' }, body, references: [], cite, esc }),
    'utf8'
  )
}

// Size report
async function dirSize(d) {
  let total = 0
  for (const entry of await readdir(d, { withFileTypes: true })) {
    const p = join(d, entry.name)
    total += entry.isDirectory() ? await dirSize(p) : (await stat(p)).size
  }
  return total
}
const bytes = await dirSize(OUT)
console.log(`\n  Built ${rendered.length} pages -> dist/  (${(bytes / 1024).toFixed(0)} KB total)`)
console.log(`  ${usedSources.size} sources cited across the site.\n`)
