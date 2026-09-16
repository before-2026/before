// Self-contained so it can also be pasted into Cloudflare's dashboard editor.
function acceptsMarkdown(accept = '') {
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

function markdownPath(pathname) {
  if (pathname.endsWith('.html')) return pathname.slice(0, -5) + '.md'
  if (/\.[^/]+$/.test(pathname)) return null
  return pathname.endsWith('/') ? pathname + 'index.md' : pathname + '/index.md'
}

function varyByAccept(current = '') {
  const dimensions = String(current).split(',').map((value) => value.trim()).filter(Boolean)
  if (!dimensions.some((value) => value.toLowerCase() === 'accept')) dimensions.push('Accept')
  return dimensions.join(', ')
}

function markdownTokenEstimate(markdown) {
  return Math.ceil([...markdown].length / 4)
}

// Attach this Worker as a Route on beforeubereats.com/*, in front of the
// existing GitHub Pages origin. A same-zone route's fetch() goes to the origin.
export async function handleRequest(request, originFetch = fetch) {
  const url = new URL(request.url)
  const pagePath = markdownPath(url.pathname)
  const isPageRequest = ['GET', 'HEAD'].includes(request.method) && pagePath !== null

  if (isPageRequest && acceptsMarkdown(request.headers.get('accept'))) {
    const markdownUrl = new URL(request.url)
    markdownUrl.pathname = pagePath
    markdownUrl.search = ''
    const sourceHeaders = new Headers(request.headers)
    sourceHeaders.set('accept', '*/*')
    // An HTML ETag does not validate the separate Markdown file.
    sourceHeaders.delete('if-none-match')
    sourceHeaders.delete('if-modified-since')
    const source = await originFetch(new Request(markdownUrl, {
      method: 'GET', headers: sourceHeaders,
    }))
    if (source.ok) {
      const markdown = await source.text()
      const headers = new Headers(source.headers)
      for (const name of ['content-length', 'content-encoding', 'content-range',
        'transfer-encoding', 'etag', 'last-modified']) headers.delete(name)
      headers.set('content-type', 'text/markdown; charset=utf-8')
      headers.set('vary', varyByAccept(headers.get('vary')))
      headers.set('x-markdown-tokens', String(markdownTokenEstimate(markdown)))
      return new Response(request.method === 'HEAD' ? null : markdown, {
        status: source.status, headers,
      })
    }
  }

  const origin = await originFetch(request)
  if (!isPageRequest) return origin
  const headers = new Headers(origin.headers)
  headers.set('vary', varyByAccept(headers.get('vary')))
  const noBody = request.method === 'HEAD' || [204, 205, 304].includes(origin.status)
  return new Response(noBody ? null : origin.body, {
    status: origin.status, statusText: origin.statusText, headers,
  })
}

export default {
  fetch(request) { return handleRequest(request) },
}
