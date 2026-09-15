import { hero, section, wide } from '../templates/components.js'
import { SOURCES } from '../data/sources.js'

const GROUPS = [
  ['regulator', 'Regulators and courts', 'Media releases, determinations, judgments and enforcement outcomes.'],
  ['law', 'Legislation and official guidance', 'Acts, statutory instruments, commission decisions and explanatory material.'],
  ['inquiry', 'Government inquiries and coronial findings', 'Parliamentary and departmental inquiries, taskforce reports, inquest findings.'],
  ['research', 'Academic and institutional research', 'Peer-reviewed studies, think tank and university research.'],
  ['union', 'Unions and industry bodies', 'Submissions, surveys and campaign material. Read with their interests in mind.'],
  ['company', 'Company statements and filings', "Uber's own newsroom posts, policies, help pages and financial reports."],
  ['news', 'News reporting', 'Journalism, preferred where it has a named author and a named source.'],
]

export const page = {
  slug: 'sources',
  order: 70,
  title: 'Sources',
  description:
    'The item listing and official guidance behind this independent food-delivery price-display investigation.',
  render: ({ site }) => {
    const all = Object.entries(SOURCES).map(([key, s]) => ({ key, ...s }))
    const byGroup = new Map(GROUPS.map(([g]) => [g, []]))
    const ungrouped = []
    for (const s of all) {
      if (s.type && byGroup.has(s.type)) byGroup.get(s.type).push(s)
      else ungrouped.push(s)
    }

    const renderList = (items) =>
      `<ul class="u-list">
      ${items
        .sort((a, b) => (a.publisher || '').localeCompare(b.publisher || ''))
        .map(
          (s) => `<li class="u-srcitem">
        <a href="${s.url}" rel="nofollow noopener noreferrer" target="_blank" class="u-bold">${s.title}</a>
        <div class="u-meta">${[s.publisher, s.date].filter(Boolean).join(' · ')}</div>
      </li>`
        )
        .join('\n      ')}
    </ul>`

    const groups = GROUPS.filter(([g]) => byGroup.get(g).length)
      .map(
        ([g, label, blurb]) => `
    <h2 id="${g}">${label} <span class="u-count">${byGroup.get(g).length}</span></h2>
    <p class="u-meta">${blurb}</p>
    ${renderList(byGroup.get(g))}`
      )
      .join('\n')

    return (
      hero({
        eyebrow: 'Reference',
        title: 'Every source, in one place',
        lede: `All ${all.length} sources cited anywhere on this site. Each page also lists its own sources at the foot of the page.`,
        meta: `<span>Reviewed ${site.updatedHuman}</span>`,
      }) +
      section(`
<p>The recorded item listing supports the A$12 price and required choices. Ub*r e*ts guidance explains pickup fees, and the ACCC explains price-display rules and drip pricing. The build rejects a citation key that has no matching source; editorial review is still needed to make sure each claim is supported.</p>
<p>Prices and menu choices may change after the recorded check. Links open on each publisher's own site and may have moved since this page was reviewed.</p>
${groups}
${ungrouped.length ? `<h2 id="other">Other</h2>${renderList(ungrouped)}` : ''}
`)
    )
  },
}
