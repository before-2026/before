const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

import { createHash } from 'node:crypto'

// Runs before paint so a saved dark preference never flashes light.
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('bue-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`

// Hash the inline script so the CSP can allow exactly it and nothing else.
const BOOT_HASH = 'sha256-' + createHash('sha256').update(THEME_BOOT, 'utf8').digest('base64')

// Locks the page to its own origin: no third-party script, style, font, frame,
// image or connection can load, and no form can submit anywhere. This is what
// makes the site's "we collect nothing about you" claim structurally true.
const CSP_BASE = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self'",
  "font-src 'self'",
  `script-src 'self' '${BOOT_HASH}'`,
  "frame-src 'none'",
  "object-src 'none'",
  "connect-src 'none'",
  "form-action 'none'",
  "base-uri 'self'",
]

// frame-ancestors is deliberately absent: browsers ignore it in a <meta> tag.
// GitHub Pages cannot set response headers, so clickjacking protection has to
// come from a host that can (see README) if it is ever needed.

/** Build the CSP for one page, allowing exactly the <style> blocks it contains. */
function cspFor(body) {
  const hashes = [...body.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(
    (m) => `'sha256-${createHash('sha256').update(m[1], 'utf8').digest('base64')}'`
  )
  return CSP_BASE.map((d) =>
    d.startsWith('style-src') ? `${d}${hashes.length ? ' ' + [...new Set(hashes)].join(' ') : ''}` : d
  ).join('; ')
}

function nav(site, current) {
  return site.nav
    .map((item) => {
      const href = item.slug === '' ? '/' : `/${item.slug}/`
      const isCurrent = item.slug === current
      return `<a href="${href}"${isCurrent ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`
    })
    .join('')
}

function references(refs) {
  if (!refs || !refs.length) return ''
  const items = refs
    .map((r, i) => {
      const n = i + 1
      const pub = r.publisher ? `<span class="pub">${esc(r.publisher)}${r.date ? `, ${esc(r.date)}` : ''}.</span> ` : ''
      return `<li id="ref-${n}">${pub}<a href="${esc(r.url)}" rel="nofollow noopener noreferrer" target="_blank">${esc(r.title)}</a></li>`
    })
    .join('\n      ')
  return `
  <section class="refs" aria-labelledby="refs-h">
    <h2 id="refs-h">Sources on this page</h2>
    <ol>
      ${items}
    </ol>
    <p class="u-refnote">Links open on the publisher's own site. Prices and choices may have changed since the check date. Found an error? <a href="https://github.com/before-2026/before/issues/new" rel="nofollow noopener noreferrer" target="_blank">Open a public issue on GitHub</a> (account required).</p>
  </section>`
}

function pageNav(site, pages, current) {
  const ordered = site.nav.filter((n) => n.slug !== 'sources' && n.slug !== 'about')
  const idx = ordered.findIndex((n) => n.slug === current)
  if (idx === -1) return ''
  const prev = idx > 0 ? ordered[idx - 1] : null
  const next = idx < ordered.length - 1 ? ordered[idx + 1] : null
  if (!prev && !next) return ''
  return `
  <nav class="page-nav" aria-label="Section">
    ${prev ? `<a href="${prev.slug ? `/${prev.slug}/` : '/'}"><small>Previous</small>${esc(prev.label)}</a>` : '<span></span>'}
    ${next ? `<a class="pn-next" href="${next.slug ? `/${next.slug}/` : '/'}"><small>Next</small>${esc(next.label)}</a>` : ''}
  </nav>`
}

export function layout({ site, pages, page, body, references: refs }) {
  const isHome = page.slug === ''
  // Every title carries an independence signal: no search result should be
  // mistakable for an Uber page.
  const title = isHome
    ? `${site.name} — ${site.tagline} | Independent, not affiliated with Uber`
    : `${page.title} — ${site.name} (independent site, not affiliated with Uber)`
  const desc = page.description || site.description
  const url = `${site.origin}/${page.slug ? page.slug + '/' : ''}`

  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${cspFor(body)}">
<meta name="referrer" content="no-referrer">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#faf7f2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#141210" media="(prefers-color-scheme: dark)">

<meta property="og:type" content="${isHome ? 'website' : 'article'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(isHome ? site.name : page.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:locale" content="en_AU">
<meta name="twitter:card" content="summary">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
<script>${THEME_BOOT}</script>
</head>
<body>
<div class="notaffil">
  <div class="wrap notaffil__inner">
    <strong>You are not on an Uber website.</strong>
    <span>This is an independent site about food-delivery price displays, with no connection to Uber Technologies,&nbsp;Inc. Looking for the app? <a href="https://www.ubereats.com" rel="nofollow noopener noreferrer">ubereats.com</a></span>
  </div>
</div>
<a class="skip" href="#main">Skip to content</a>

<header class="masthead">
  <div class="wrap masthead__inner">
    <a class="wordmark" href="/">Before Ub*r e*ts<span class="dot">.</span></a>
    <nav class="nav" aria-label="Primary">${nav(site, page.slug)}</nav>
    <button class="theme-toggle" type="button" aria-label="Switch theme" title="Switch between light and dark">
      <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.2v2.4M12 19.4v2.4M4.3 4.3l1.7 1.7M18 18l1.7 1.7M2.2 12h2.4M19.4 12h2.4M4.3 19.7L6 18M18 6l1.7-1.7"/></svg>
      <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8z"/></svg>
    </button>
  </div>
</header>

<main id="main">
${body}
${refs && refs.length ? `<div class="wrap"><div class="prose">${references(refs)}</div></div>` : ''}
${!isHome ? `<div class="wrap"><div class="prose">${pageNav(site, pages, page.slug)}</div></div>` : ''}
</main>

<footer class="foot">
  <div class="wrap">
    <div class="foot__grid">
      <div>
        <h2>${esc(site.name)}</h2>
        <p class="u-footblurb">${esc(site.description)}</p>
        <p class="updated">Last reviewed ${esc(site.updatedHuman)}</p>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>
          <li><a href="/">Overview</a></li>
          <li><a href="/the-price/">The A$12 case</a></li>
        </ul>
      </div>
      <div>
        <h2>This site</h2>
        <ul>
          <li><a href="/sources/">All sources</a></li>
          <li><a href="/about/">About &amp; method</a></li>
          <li><a href="https://github.com/before-2026/before/issues/new" rel="nofollow noopener noreferrer" target="_blank">Flag an error</a></li>
        </ul>
      </div>
    </div>

    <div class="foot__legal">
      <p><strong>Not affiliated with Uber.</strong> ${esc(site.name)} is an independent, non-commercial site published in Australia. It is not associated with, endorsed by, or connected to Uber Technologies, Inc., Uber Australia Pty Ltd, or any of their related companies. References to Uber and its food-delivery service identify only the subjects of this independent commentary; no claim is made to their names or trade marks.</p>
      <p>This site carries no advertising, no affiliate links, no sponsorship and no tracking, and it collects no personal information from visitors. Its documented price example links to the recorded listing and official guidance. Prices and options may change after the check date. See <a href="/about/">About &amp; method</a> for how the example was researched.</p>
      <p>Content is offered for reuse under <a href="https://creativecommons.org/licenses/by/4.0/" rel="license noopener noreferrer" target="_blank">CC&nbsp;BY&nbsp;4.0</a>. Nothing here is legal, financial or employment advice.</p>
    </div>
  </div>
</footer>

<script src="/site.js" defer></script>
</body>
</html>
`
    .replace(/\n{3,}/g, '\n\n')
}

export { esc, pageNav, references }
