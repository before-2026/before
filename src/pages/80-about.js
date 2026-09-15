import { hero, section, callout } from '../templates/components.js'

export const page = {
  slug: 'about',
  order: 80,
  title: 'About, method and corrections',
  description:
    'Who publishes this site, how it is researched, how fact is separated from opinion, and how to get something corrected.',
  render: ({ site }) =>
    hero({
      eyebrow: 'About',
      title: 'How this site is made',
      lede:
        'An independent, non-commercial site with no advertising, no affiliate links and no tracking. Everything on it is sourced, dated and open to correction.',
      meta: `<span>Last reviewed ${site.updatedHuman}</span>`,
    }) +
    section(`
<h2 id="what">What this site is</h2>

<p>${site.name} is a public-interest site about the real costs of food delivery platforms in Australia &mdash; what they mean for the people who deliver the food, for the restaurants that cook it, and for the price on your screen.</p>

<p>It is published by a private individual in Australia. It is not a campaign organisation, it does not represent any union, industry body or company, and it has no commercial relationship with any business mentioned on it.</p>

${callout(
  'Not affiliated with Uber',
  `<p class="u-flush">This site is independent. It is not associated with, endorsed by, sponsored by or connected to Uber Technologies, Inc., Uber Australia Pty Ltd or any related company. References to Uber and its food-delivery service identify only the subjects of this independent commentary; no claim is made to their names or trade marks.</p>`,
  'uber'
)}

<h2 id="method">How it is researched</h2>

<p>The method matters more than the conclusions, because it is the thing you can check.</p>

<ol>
  <li><strong>Primary sources first.</strong> Regulator media releases and enforcement outcomes, court judgments, legislation, coronial findings, parliamentary and government inquiry reports, peer-reviewed research, and company filings and published policies. News reporting is used where it adds something primary sources do not, and preferred where it has a named author. Forums, blogs and aggregators are never used to support a factual claim.</li>
  <li><strong>Every source is opened.</strong> A citation means the linked page was read and it says what the claim says. Sources that could not be retrieved are not cited.</li>
  <li><strong>Claims are checked against the source a second time,</strong> by someone whose job is to disprove them rather than confirm them. Where a source supported only a weaker version of a claim, the weaker version is what appears here.</li>
  <li><strong>Figures carry the date they apply to.</strong> Where a number has changed over time, the site says what it was and what it is now. Commission rates, fees and the law itself have all moved, and a true statement about 2020 can be a false one about today.</li>
  <li><strong>The other side is included.</strong> Where a company disputes a claim, or has changed the practice, or has a reasonable answer, that appears alongside the claim rather than at the bottom of the page.</li>
</ol>

<p>The build itself enforces the first rule: this site is generated from source files in which every factual statement is tied to a citation key, and the site will not build if a claim points at a source that does not exist. An unsourced claim cannot reach the published page by accident.</p>

<h2 id="reading">Fact, opinion, and how to tell them apart</h2>

<p>Most of this site is checkable fact with a link attached. Some of it is argument &mdash; a view about what those facts add up to. The two are kept apart deliberately.</p>

<ul>
  <li><strong>Statements of fact</strong> carry a numbered citation. Follow it and you should land on a source that says the same thing.</li>
  <li><strong>Opinion and argument</strong> are written as such, and are based on the facts set out alongside them. You are welcome to read the same facts and reach a different conclusion.</li>
  <li><strong>Where the evidence is thin,</strong> the site says so rather than rounding up. &ldquo;There is no published Australian data on this&rdquo; is a finding worth stating.</li>
  <li><strong>Where something is untested,</strong> the site does not pretend otherwise. In particular, this site does not describe any conduct as unlawful unless a court has held it to be, or a statute plainly says so. Where conduct raises a question under the law, the site says that it <em>may</em> raise a question, and links to the law so you can judge.</li>
</ul>

<h2 id="privacy">What this site collects about you</h2>

<p>Nothing.</p>

<p>There is no analytics, no advertising, no affiliate link, no cookie, no embedded video, no web font and no third-party script of any kind. Your browser makes requests to this site and to nowhere else. There is no account to create, no newsletter to join, and no contact form that stores what you type.</p>

<p>Links to other websites are ordinary links. Once you follow one, that site's own practices apply.</p>

<h2 id="money">How it is funded</h2>

<p>It isn't. There is no advertising, no sponsorship, no affiliate revenue, no merchandise and no donations. Nobody is paid and nothing on this site is an attempt to sell you anything &mdash; including the alternatives it mentions, none of which have any relationship with this site.</p>

<h2 id="corrections">Corrections and right of reply</h2>

<p>This site will get things wrong. Prices change, companies change their practices, and the law moves. When something here is inaccurate, the priority is to fix it quickly and visibly.</p>

<p><strong>If you are Uber, a restaurant, a worker, a regulator, or anyone else named or described here, and something on this site is inaccurate or out of date, tell us and it will be corrected.</strong> That includes practices that have changed since a page was written &mdash; if a figure is historical, the site should say so, and if it has not caught up, that is an error worth reporting.</p>

<p>How corrections are handled:</p>

<ul>
  <li>Factual errors are corrected as soon as they are verified.</li>
  <li>Material corrections are noted on the page, with the date and what changed, rather than quietly edited away.</li>
  <li>Anyone criticised here may ask for a response to be published alongside the criticism, and a reasonable one will be.</li>
  <li>Disagreement about interpretation is not an error, but a well-argued alternative reading is worth publishing and will be considered on its merits.</li>
</ul>

${callout(
  'Contact',
  `<p class="u-flush">Add a contact route here before publishing &mdash; an email address you are willing to make public. A correction policy with no way to reach the publisher is not a correction policy, and a visible, working contact route is one of the clearest signals that a site is a genuine good-faith commentary site rather than anything else.</p>`,
  'caution'
)}

<h2 id="reuse">Reuse</h2>

<p>The writing and original graphics on this site are offered under a <a href="https://creativecommons.org/licenses/by/4.0/" rel="license noopener noreferrer" target="_blank">Creative Commons Attribution 4.0</a> licence &mdash; use them, including commercially, with attribution and a link. The underlying facts are not owned by anyone.</p>

<p>Every graphic here is original. This site deliberately reproduces no photographs, no company logos and no application screenshots, and quotes from other publications only briefly and with attribution. Where it describes what an app displayed, it rebuilds the arrangement in its own design rather than copying the image.</p>

<p class="u-fineprint">Nothing on this site is legal, financial, employment or tax advice. If you need advice about your own situation, speak to someone qualified to give it.</p>
`),
}
