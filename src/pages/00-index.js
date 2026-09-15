import { hero, section, priceLadder, callout } from '../templates/components.js'

export const page = {
  slug: '',
  order: 0,
  title: 'Drip pricing in food delivery',
  description:
    'A documented Australian food-delivery listing showed a $12 item, but required choices made its lowest selectable item price $16 before delivery or service fees.',
  render: ({ cite, site }) =>
    hero({
      eyebrow: 'A documented price gap',
      title: 'A$12 on the menu. At least A$16 to select it.',
      lede:
        `A food-delivery listing checked on 15 September 2026 required a paid preparation choice and a paid sauce. Together they added at least A$4 to the displayed A$12 item price${cite('m-brothers-plate')}.`,
      meta: `<span>Checked ${site.updatedHuman}</span><span class="dotsep">&middot;</span><span>Australia</span>`,
    }) +
    section(`
<h2>Where the extra A$4 appeared</h2>

<p>The menu tile showed a chargrilled kebab plate at <strong>A$12.00</strong>. Inside the item, <em>Choice of Preparation</em> was marked required and its cheapest options added <strong>A$3.00</strong>. A required sauce added at least <strong>A$1.00</strong>. At the recorded check, neither group offered a no-cost way to complete the choice${cite('m-brothers-plate')}.</p>

${priceLadder({
  advertised: 12,
  steps: [
    { label: 'Preparation', amount: 3, forced: true, note: 'Required; cheapest available choice.' },
    { label: 'Sauce', amount: 1, forced: true, note: 'Required; cheapest available choice.' },
  ],
  caption:
    'M Brothers Cafe & Restaurant item listing, checked 15 September 2026. This is the minimum selectable item price observed then, not a final checkout quote. Options and prices may have changed.',
  currency: 'A$',
})}

<h2>Pickup does not remove the item choices</h2>

<p>Ub*r e*ts says pickup orders are exempt from delivery and service fees${cite('pickup-fees')}. Those fees are separate from the required choices inside this item. Choosing pickup could avoid the delivery-related fees, but it did not make the A$12 item selectable without the A$3 preparation and A$1 sauce at this check${cite('m-brothers-plate')}.</p>

${callout(
  'Why look at this as drip pricing?',
  `<p>The ACCC describes drip pricing as a price advertised early in an online purchase with extra charges added as the customer proceeds. Its price-display guidance says the minimum total should include unavoidable extra costs${cite('accc-price-displays')}.</p>
   <p class="u-flush">This one listing shows a clear A$4 gap between the displayed item price and its lowest selectable item price. It does not establish who configured the choices, how common the pattern is, or whether a court would find a legal breach.</p>`,
  'key'
)}

<p><a class="btn" href="/the-price/">Read the full A$12 case</a> <a href="/sources/">Check the sources</a></p>
`),
}
