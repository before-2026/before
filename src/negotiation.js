export function acceptsMarkdown(accept = '') {
  let markdown = 0
  let html = 0
  for (const option of String(accept).split(',')) {
    const [mediaType, ...parameters] = option.trim().split(';')
    const type = mediaType.trim().toLowerCase()
    if (type !== 'text/markdown' && type !== 'text/html') continue
    const quality = parameters.map((parameter) => parameter.trim())
      .find((parameter) => /^q\s*=/i.test(parameter))
    const value = quality ? Number(quality.split('=')[1]?.trim()) : 1
    if (!Number.isFinite(value) || value < 0 || value > 1) continue
    if (type === 'text/markdown') markdown = Math.max(markdown, value)
    else html = Math.max(html, value)
  }
  return markdown > 0 && markdown >= html
}

export function markdownPath(pathname) {
  if (pathname.endsWith('.html')) return pathname.slice(0, -5) + '.md'
  if (/\.[^/]+$/.test(pathname)) return null
  return pathname.endsWith('/') ? pathname + 'index.md' : pathname + '/index.md'
}

export function varyByAccept(current = '') {
  const dimensions = String(current).split(',').map((value) => value.trim()).filter(Boolean)
  if (!dimensions.some((value) => value.toLowerCase() === 'accept')) dimensions.push('Accept')
  return dimensions.join(', ')
}

export function markdownTokenEstimate(markdown) {
  // Approximation: one token per four Unicode characters. No tokenizer dependency.
  return Math.ceil([...markdown].length / 4)
}
