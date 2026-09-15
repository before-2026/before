export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Page opening block. */
export function hero({ eyebrow, title, lede, meta }) {
  return `
<section class="hero">
  <div class="wrap">
    <div class="hero__inner">
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1>${title}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
      ${meta ? `<div class="hero__meta">${meta}</div>` : ''}
    </div>
  </div>
</section>`
}

/** A band of content at reading width. */
export function section(inner, { tint = false, id = '' } = {}) {
  return `
<section class="section${tint ? ' section--tint' : ''}"${id ? ` id="${esc(id)}"` : ''}>
  <div class="wrap"><div class="prose">
${inner}
  </div></div>
</section>`
}

/** Full-bleed band (for stat grids and tables that want more room). */
export function wide(inner, { tint = false, id = '' } = {}) {
  return `
<section class="section${tint ? ' section--tint' : ''}"${id ? ` id="${esc(id)}"` : ''}>
  <div class="wrap">
${inner}
  </div>
</section>`
}

/** Row of headline figures. Each: {num, label, src} */
export function stats(items) {
  return `<div class="stats">
  ${items
    .map(
      (s) => `<div class="stat">
    <span class="stat__num">${s.num}</span>
    <span class="stat__label">${s.label}</span>
    ${s.src ? `<span class="stat__src">${s.src}</span>` : ''}
  </div>`
    )
    .join('\n  ')}
</div>`
}

/** Aside box. kind: 'uber' | 'caution' | 'key' | '' */
export function callout(title, inner, kind = '') {
  return `<aside class="callout${kind ? ` callout--${kind}` : ''}">
  ${title ? `<span class="callout__title">${esc(title)}</span>` : ''}
  ${inner}
</aside>`
}

/**
 * Where the money goes. segments: {label, amount, colour, note}
 * Widths are derived from amounts so the picture cannot drift from the numbers.
 */
export function moneyFlow({ id, total, segments, caption }) {
  if (!id) throw new Error('moneyFlow needs an id (used for its generated CSS class names)')
  const sum = segments.reduce((a, s) => a + s.amount, 0)
  const fmt = (n) => '$' + n.toFixed(2)
  // Widths are generated into a <style> block rather than inline style
  // attributes, so the page's CSP can keep style-src locked to 'self'.
  const rules = segments
    .map((s, i) => {
      const pct = ((s.amount / sum) * 100).toFixed(3)
      return `#${id} .s${i}{width:${pct}%;background:${s.colour}}#${id} .w${i}{background:${s.colour}}`
    })
    .join('')
  return `<style>${rules}</style>
<figure class="flow" id="${esc(id)}">
  <div class="flow__bar" role="img" aria-label="${esc(segments.map((s) => `${s.label}: ${fmt(s.amount)}`).join('; '))}">
    ${segments
      .map((s, i) => {
        const pct = (s.amount / sum) * 100
        return `<div class="flow__seg s${i}">${pct > 9 ? fmt(s.amount) : ''}</div>`
      })
      .join('\n    ')}
  </div>
  <div class="flow__legend">
    ${segments
      .map(
        (s, i) => `<div class="flow__item">
      <span class="flow__swatch w${i}"></span>
      <span>${s.label}${s.note ? ` <span class="u-muted">— ${s.note}</span>` : ''}</span>
      <span class="flow__amt">${fmt(s.amount)}</span>
    </div>`
      )
      .join('\n    ')}
    <div class="flow__item flow__item--total">
      <span class="u-bold">What you paid</span>
      <span class="flow__amt">${fmt(total)}</span>
    </div>
  </div>
  ${caption ? `<figcaption class="flow__cap">${caption}</figcaption>` : ''}
</figure>`
}

/** Dated events. items: {date, body} */
export function timeline(items) {
  return `<ol class="timeline">
  ${items
    .map(
      (i) => `<li>
    <span class="tl-date">${esc(i.date)}</span>
    <span class="tl-body">${i.body}</span>
  </li>`
    )
    .join('\n  ')}
</ol>`
}

/** Data table. cols: [{key,label,num}] rows: [{...}] */
export function table({ caption, cols, rows }) {
  return `<div class="table-scroll">
  <table>
    ${caption ? `<caption>${caption}</caption>` : ''}
    <thead><tr>${cols.map((c) => `<th${c.num ? ' class="num"' : ''} scope="col">${esc(c.label)}</th>`).join('')}</tr></thead>
    <tbody>
      ${rows
        .map(
          (r) =>
            `<tr>${cols
              .map((c, i) =>
                i === 0
                  ? `<th scope="row" class="u-bold">${r[c.key] ?? ''}</th>`
                  : `<td${c.num ? ' class="num"' : ''}>${r[c.key] ?? ''}</td>`
              )
              .join('')}</tr>`
        )
        .join('\n      ')}
    </tbody>
  </table>
</div>`
}

/** Navigation cards for the home page. */
export function cards(items) {
  return `<div class="cards">
  ${items
    .map(
      (c, i) => `<a class="card" href="${esc(c.href)}">
    <span class="card__n">${String(i + 1).padStart(2, '0')}</span>
    <h3>${esc(c.title)}</h3>
    <p>${c.body}</p>
    <span class="card__go">${esc(c.cta || 'Read on')} <span aria-hidden="true">&rarr;</span></span>
  </a>`
    )
    .join('\n  ')}
</div>`
}

/** Short attributed quotation. Keep quotes brief — paraphrase where you can. */
export function quote(text, who) {
  return `<blockquote><p>${text}</p>${who ? `<cite>${who}</cite>` : ''}</blockquote>`
}

/** In-page contents list. items: {href, label} */
export function toc(items) {
  return `<nav class="toc" aria-label="On this page">
  <h2>On this page</h2>
  <ol>
    ${items.map((i) => `<li><a href="${esc(i.href)}">${esc(i.label)}</a></li>`).join('\n    ')}
  </ol>
</nav>`
}

/**
 * Price ladder: an advertised price, then the additions you cannot decline,
 * then what you actually pay. Rebuilt as original markup — never a screenshot.
 * steps: {label, amount, note, forced}
 */
export function priceLadder({ advertised, was, steps, caption, currency = '$' }) {
  const fmt = (n) => currency + n.toFixed(2)
  const total = advertised + steps.reduce((a, s) => a + s.amount, 0)
  const forcedTotal = advertised + steps.filter((s) => s.forced).reduce((a, s) => a + s.amount, 0)
  const upliftPct = Math.round(((forcedTotal - advertised) / advertised) * 100)

  return `<figure class="ladder">
  <div class="ladder__head">
    <div class="ladder__advertised">
      <span class="ladder__tag">What the menu shows</span>
      <span class="ladder__price">
        ${was ? `<s aria-label="Crossed out former price">${fmt(was)}</s> ` : ''}<strong>${fmt(advertised)}</strong>
      </span>
      ${was ? `<span class="ladder__off">${Math.round(((was - advertised) / was) * 100)}% off</span>` : ''}
    </div>
  </div>

  <ol class="ladder__steps">
    ${steps
      .map(
        (s) => `<li class="ladder__step${s.forced ? ' is-forced' : ''}">
      <span class="ladder__step-label">
        ${esc(s.label)}
        ${s.forced ? '<span class="ladder__req">Required</span>' : '<span class="ladder__opt">Optional</span>'}
        ${s.note ? `<span class="ladder__note">${esc(s.note)}</span>` : ''}
      </span>
      <span class="ladder__amt">+${fmt(s.amount)}</span>
    </li>`
      )
      .join('\n    ')}
  </ol>

  <div class="ladder__total">
    <div class="ladder__total-row">
      <span>Lowest selectable item price</span>
      <strong>${fmt(forcedTotal)}</strong>
    </div>
    ${
      total !== forcedTotal
        ? `<div class="ladder__total-row ladder__total-row--muted">
      <span>With the optional extras above</span>
      <strong>${fmt(total)}</strong>
    </div>`
        : ''
    }
    <div class="ladder__delta">
      The advertised item price is <strong>${fmt(advertised)}</strong>. The lowest selectable item price is
      <strong>${fmt(forcedTotal)}</strong> — <strong>${upliftPct}% more</strong>, before any delivery fee,
      service fee or tip.
    </div>
  </div>
  ${caption ? `<figcaption class="ladder__cap">${caption}</figcaption>` : ''}
</figure>`
}

/** Side-by-side comparison of two totals. */
export function compareTotals({ left, right, caption }) {
  const fmt = (n) => '$' + n.toFixed(2)
  const col = (c, accent) => `<div class="cmp__col${accent ? ' is-accent' : ''}">
    <span class="cmp__title">${esc(c.title)}</span>
    <ul class="cmp__lines">
      ${c.lines.map((l) => `<li><span>${esc(l.label)}</span><span class="cmp__n">${l.amount === 0 ? '—' : fmt(l.amount)}</span></li>`).join('\n      ')}
    </ul>
    <div class="cmp__total"><span>Total</span><strong>${fmt(c.lines.reduce((a, l) => a + l.amount, 0))}</strong></div>
    ${c.note ? `<p class="cmp__note">${c.note}</p>` : ''}
  </div>`
  return `<figure class="cmp">
  <div class="cmp__grid">
    ${col(left, false)}
    ${col(right, true)}
  </div>
  ${caption ? `<figcaption class="ladder__cap">${caption}</figcaption>` : ''}
</figure>`
}

/**
 * An evaluative passage. Opinion lives here and nowhere else, so a reader can
 * always tell which parts of a page are argument rather than sourced fact.
 */
export function ourView(inner, basis) {
  return `<aside class="ourview">
  <p class="ourview__title">Our view</p>
  ${inner}
  ${basis ? `<p class="ourview__basis">${basis}</p>` : ''}
</aside>`
}

/**
 * Evidence grade for a statement.
 *   finding — an adjudicator decided it (court, tribunal, coroner, regulator)
 *   record  — documented in a linked source; nobody has ruled on it
 *   account — someone says it happened; not independently verified
 */
export function grade(kind) {
  const label = { finding: 'Finding', record: 'Record', account: 'Account' }[kind] || kind
  const title = {
    finding: 'A court, tribunal, coroner or regulator decided this.',
    record: 'Documented in the linked source. No adjudicator has ruled on it.',
    account: "Someone's account of what happened. Not independently verified.",
  }[kind]
  return `<span class="grade grade--${kind}" title="${esc(title)}">${label}</span>`
}

/** First published / last revised / figures verified. */
export function pageDates({ published, revised, verified }) {
  return `<div class="pagedates">
  <div><strong>First published</strong> <time datetime="${esc(published)}">${esc(published)}</time></div>
  <div><strong>Last substantively revised</strong> <time datetime="${esc(revised)}">${esc(revised)}</time></div>
  ${verified ? `<div><strong>Figures on this page last verified</strong> <time datetime="${esc(verified)}">${esc(verified)}</time></div>` : ''}
  <div style="margin-top:.6rem">Something here wrong or out of date? <a href="/about/#corrections">Ask for a correction.</a></div>
</div>`
}
