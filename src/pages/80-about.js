import { hero, section, callout } from '../templates/components.js'

export const page = {
  slug: 'about',
  order: 80,
  title: 'About, method and corrections',
  description:
    'How this independent site documents one food-delivery price display, checks its sources, and handles corrections.',
  render: ({ site }) =>
    hero({
      eyebrow: 'About',
      title: 'How this site is made',
      lede:
        'An independent, non-commercial site examining one food-delivery price display. The example is dated, linked to its sources and open to correction.',
      meta: `<span>Last reviewed ${site.updatedHuman}</span>`,
    }) +
    section(`
<h2 id="what">What this site is</h2>

<p>${site.name} examines how required choices within one Australian food-delivery listing raised the lowest selectable item price above the price shown on the menu tile. It uses that documented example to explain the question raised by drip pricing and price-display guidance.</p>

<p>It is published by a private individual in Australia. It is not a campaign organisation, it does not represent any union, industry body or company, and it has no commercial relationship with any business mentioned on it.</p>

${callout(
  'Not affiliated with Uber',
  `<p class="u-flush">This site is independent. It is not associated with, endorsed by, sponsored by or connected to Uber Technologies, Inc., Uber Australia Pty Ltd or any related company. References to Uber and its food-delivery service identify only the subjects of this independent commentary; no claim is made to their names or trade marks.</p>`,
  'uber'
)}

<h2 id="method">How it is researched</h2>

<p>The method matters more than the conclusions, because it is the thing you can check.</p>

<ol>
  <li><strong>Record the date.</strong> The A$12 listing and its required choices were checked on 15 September 2026. The linked menu can change; the site describes what was seen at that check.</li>
  <li><strong>Separate the item from checkout.</strong> The A$16 figure is the lowest selectable item price observed with the cheapest required choices. It is not a final order or checkout quote.</li>
  <li><strong>Link the evidence.</strong> The item listing supports the price and choice details. Ub*r e*ts guidance supports the pickup-fee distinction. ACCC guidance supports the general discussion of price displays and drip pricing.</li>
  <li><strong>Keep the legal conclusion narrow.</strong> A price gap is documented; this site does not identify who configured the item or claim a court has ruled on this listing.</li>
</ol>

<p>The build rejects citations to missing sources. Whether every factual sentence has adequate support still requires editorial review; the build cannot determine that on its own.</p>

<h2 id="reading">Fact, opinion, and how to tell them apart</h2>

<p>Most of this site is checkable fact with a link attached. Some of it is argument &mdash; a view about what those facts add up to. The two are kept apart deliberately.</p>

<ul>
  <li><strong>Statements of fact</strong> carry a numbered citation. Follow it and you should land on a source that says the same thing.</li>
  <li><strong>Opinion and argument</strong> are written as such, and are based on the facts set out alongside them. You are welcome to read the same facts and reach a different conclusion.</li>
  <li><strong>Where the evidence is thin,</strong> the site says so rather than rounding up. &ldquo;There is no published Australian data on this&rdquo; is a finding worth stating.</li>
  <li><strong>Where something is untested,</strong> the site says so. It links to <a href="/sources/">ACCC guidance</a> on price displays while leaving the legal application and responsibility for this particular listing open.</li>
</ul>

<h2 id="privacy">What this site collects about you</h2>

<p>Nothing.</p>

<p>There is no analytics, no advertising, no affiliate link, no cookie, no embedded video, no web font and no third-party script of any kind. Your browser makes requests to this site and to nowhere else. There is no account to create, no newsletter to join, and no contact form that stores what you type.</p>

<p>Links to other websites are ordinary links. Once you follow one, that site's own practices apply.</p>

<h2 id="money">How it is funded</h2>

<p>It isn't. There is no advertising, no sponsorship, no affiliate revenue, no merchandise and no donations. Nobody is paid and nothing on this site is an attempt to sell you anything.</p>

<h2 id="corrections">Corrections and right of reply</h2>

<p>This site will get things wrong. Prices change, companies change their practices, and the law moves. When something here is inaccurate, the priority is to fix it quickly and visibly.</p>

<p><strong>If you are the platform, the restaurant, a regulator or a reader, and something on this site is inaccurate or out of date, please flag it.</strong> The recorded listing may have changed since 15 September 2026.</p>

<p>How corrections are handled:</p>

<ul>
  <li>Factual errors are corrected as soon as they are verified.</li>
  <li>Material corrections are noted on the page, with the date and what changed, rather than quietly edited away.</li>
  <li>Anyone described here may submit a response to be considered alongside the relevant claim.</li>
  <li>A well-supported alternative interpretation will be considered on its merits.</li>
</ul>

${callout(
  'Contact',
  `<p class="u-flush">To flag a factual error or request a response, <a href="https://github.com/before-2026/before/issues/new" rel="nofollow noopener noreferrer" target="_blank">open a public issue in the site's GitHub repository</a>. A GitHub account is required; issues are public, so do not include private information.</p>`,
  'caution'
)}

<h2 id="reuse">Reuse</h2>

<p>The writing and original graphics on this site are offered under a <a href="https://creativecommons.org/licenses/by/4.0/" rel="license noopener noreferrer" target="_blank">Creative Commons Attribution 4.0</a> licence &mdash; use them, including commercially, with attribution and a link. The underlying facts are not owned by anyone.</p>

<p>Every graphic here is original. This site deliberately reproduces no photographs, no company logos and no application screenshots, and quotes from other publications only briefly and with attribution. Where it describes what an app displayed, it rebuilds the arrangement in its own design rather than copying the image.</p>

<p class="u-fineprint">Nothing on this site is legal, financial, employment or tax advice. If you need advice about your own situation, speak to someone qualified to give it.</p>
`),
}
