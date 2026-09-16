// Convert the site's own semantic page body, rather than its navigation and layout,
// into a compact agent-readable document. No network calls or runtime packages.
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', middot: '·',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', bull: '•',
}

function decodeEntities(value) {
  return String(value).replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (match, key) => {
    if (key[0] === '#') {
      const number = key[1]?.toLowerCase() === 'x'
        ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10)
      return Number.isInteger(number) && number <= 0x10ffff
        ? String.fromCodePoint(number) : match
    }
    return ENTITIES[key.toLowerCase()] ?? match
  })
}

function plainText(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

function inline(html) {
  const tokens = html.match(/<[^>]+>|[^<]+/g) ?? []
  const links = []
  let result = ''
  for (const token of tokens) {
    if (!token.startsWith('<')) {
      result += decodeEntities(token).replace(/\\/g, '\\\\')
        .replace(/([*_[\]`])/g, '\\$1')
      continue
    }
    if (/^<a\b/i.test(token)) {
      const match = token.match(/\bhref=(['"])(.*?)\1/i)
      links.push({ start: result.length, href: decodeEntities(match?.[2] ?? '') })
    } else if (/^<\/a\s*>/i.test(token)) {
      const link = links.pop()
      if (link?.href) result = result.slice(0, link.start)
        + `[${result.slice(link.start)}](${link.href})`
    } else if (/^<strong\b|^<b\b/i.test(token) || /^<\/strong\s*>|^<\/b\s*>/i.test(token)) {
      result += '**'
    } else if (/^<em\b|^<i\b/i.test(token) || /^<\/em\s*>|^<\/i\s*>/i.test(token)) {
      result += '*'
    } else if (/^<s\b/i.test(token) || /^<\/s\s*>/i.test(token)) {
      result += '~~'
    } else if (/^<div\b[^>]*class=['"][^'"]*u-meta/i.test(token)) {
      result += ' — '
    } else if (/^<br\b/i.test(token)) {
      result += ' '
    }
  }
  return result.replace(/\s+/g, ' ').trim()
    .replace(/CITETOKEN([\dX]+)END/g, (_, numbers) =>
      ' ' + numbers.split('X').map((number) => `[${number}]`).join(', '))
}

function first(html, expression) {
  return plainText(html.match(expression)?.[1] ?? '')
}

function ladderMarkdown(html) {
  const advertised = first(html, /<span class="ladder__price">[\s\S]*?<strong>([\s\S]*?)<\/strong>/i)
  const former = first(html, /<span class="ladder__price">[\s\S]*?<s[^>]*>([\s\S]*?)<\/s>/i)
  const badge = first(html, /<span class="ladder__off">([\s\S]*?)<\/span>/i)
  const total = first(html, /<div class="ladder__total-row">[\s\S]*?<strong>([\s\S]*?)<\/strong>/i)
  const steps = [...html.matchAll(/<li class="ladder__step[^\"]*">([\s\S]*?)<\/li>/gi)]
    .map(([, step]) => {
      const label = first(step, /<span class="ladder__step-label">\s*([^<]+)/i)
      const amount = first(step, /<span class="ladder__amt">([\s\S]*?)<\/span>/i)
      const note = first(step, /<span class="ladder__note">([\s\S]*?)<\/span>/i)
      return `- Required ${label}: ${amount}${note ? ` — ${note}` : ''}`
    })
  const caption = first(html, /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)
  return [
    `**Menu price:** ${advertised}${former ? ` (tile also showed ${former}${badge ? ` and a ${badge} badge` : ''})` : ''}`,
    ...steps,
    `**Lowest selectable item price:** ${total}`,
    caption ? `*${caption}*` : '',
  ].filter(Boolean).join('\n')
}

function comparisonMarkdown(html) {
  const titles = [...html.matchAll(/<span class="cmp__title">([\s\S]*?)<\/span>/gi)]
    .map(([, title]) => plainText(title))
  const lists = [...html.matchAll(/<ul class="cmp__lines">([\s\S]*?)<\/ul>/gi)]
  const totals = [...html.matchAll(/<div class="cmp__total">([\s\S]*?)<\/div>/gi)]
  const notes = [...html.matchAll(/<p class="cmp__note">([\s\S]*?)<\/p>/gi)]
  const blocks = titles.map((title, index) => {
    const lines = [...(lists[index]?.[1] ?? '').matchAll(/<li>([\s\S]*?)<\/li>/gi)]
      .map(([, row]) => {
        const parts = [...row.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi)]
          .map(([, value]) => plainText(value))
        return `- ${parts[0] ?? ''}: ${parts[1] ?? ''}`
      })
    const total = first(totals[index]?.[1] ?? '', /<strong>([\s\S]*?)<\/strong>/i)
    const note = plainText(notes[index]?.[1] ?? '')
    return [`**${title}**`, ...lines, `**Item total:** ${total}`, note].filter(Boolean).join('\n')
  })
  const caption = first(html, /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)
  return [...blocks, caption ? `*${caption}*` : ''].filter(Boolean).join('\n\n')
}

export function markdownForPage({ body, page, site, references = [] }) {
  const figures = []
  let content = body
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<div class="hero__meta">[\s\S]*?<\/div>/gi, '')
    .replace(/<p class="eyebrow">[\s\S]*?<\/p>/gi, '')

  content = content.replace(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/gi, (_, attrs, figure) => {
    const converted = /class="ladder"/.test(attrs) ? ladderMarkdown(figure)
      : /class="cmp"/.test(attrs) ? comparisonMarkdown(figure)
      : plainText(figure)
    const index = figures.push(converted) - 1
    return `\n\n@@FIGURE_${index}@@\n\n`
  })
  content = content.replace(/<sup class="cites">([\s\S]*?)<\/sup>/gi, (_, cited) => {
    const numbers = [...cited.matchAll(/<a\b[^>]*>(\d+)<\/a>/gi)].map(([, n]) => n)
    return `CITETOKEN${numbers.join('X')}END`
  })
  content = content.replace(/<span class="callout__title">([\s\S]*?)<\/span>/gi,
    (_, title) => `<h3>${title}</h3>`)
  content = content.replace(/<(ol|ul)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, kind, list) => {
    const items = [...list.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(([, item], index) => `${kind.toLowerCase() === 'ol' ? `${index + 1}.` : '-'} ${inline(item)}`)
    return `\n\n${items.join('\n')}\n\n`
  })
  content = content.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, level, heading) => `\n\n${'#'.repeat(Number(level))} ${inline(heading)}\n\n`)
  content = content.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi,
    (_, paragraph) => `\n\n${inline(paragraph)}\n\n`)
  content = decodeEntities(content.replace(/<[^>]+>/g, ''))
    .replace(/@@FIGURE_(\d+)@@/g, (_, index) => figures[Number(index)])
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()

  const origin = site.origin.replace(/\/$/, '')
  const url = `${origin}/${page.slug ? `${page.slug}/` : ''}`
  const sources = references.length ? '\n\n## Sources\n\n' + references
    .map((source, index) =>
      `${index + 1}. [${inline(source.title)}](${source.url}) — ${inline(source.publisher)}, ${inline(source.date)}`)
    .join('\n') : ''
  return `---\ntitle: ${JSON.stringify(page.title)}\ndescription: ${JSON.stringify(page.description || site.description)}\nurl: ${JSON.stringify(url)}\nreviewed: ${site.updated}\n---\n\n${content}${sources}\n`
}
