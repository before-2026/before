import { hero, section, priceLadder, compareTotals, callout, toc } from '../templates/components.js'

export const page = {
  slug: 'the-price',
  order: 10,
  title: 'The price you see is not the price you pay',
  description:
    'A real Ub*r e*ts listing advertised a kebab plate at $12 with a "33% off" badge. The required choices made the lowest selectable item price $16 — 33% more. And that gap has nothing to do with delivery.',
  render: ({ cite, site }) =>
    hero({
      eyebrow: 'Start here',
      title: 'The $12 plate that costs $16',
      lede:
        'This is one real listing, checked in September 2026. Its displayed $12 item price could not be selected without at least $4 in required choices.',
      meta: `<span>Recorded ${site.updatedHuman}</span><span class="dotsep">&middot;</span><span>Australia</span>`,
    }) +
    section(`
${toc([
  { href: '#listing', label: 'What the menu showed' },
  { href: '#pickup', label: 'Why delivery fees are not the explanation' },
  { href: '#pattern', label: 'What one listing shows' },
])}

<h2 id="listing">What the menu showed</h2>

<p>On the storefront, the item appeared as a chargrilled kebab plate at <strong>$12.00</strong>, with $18.00 struck through beside it and a <strong>33% off</strong> badge. At a glance, that is a twelve dollar meal, marked down${cite('m-brothers-plate')}.</p>

<p>Opening the item told a different story. <em>Choice of Preparation</em> was marked <strong>Required</strong>, <em>Choose 1</em>; every option cost extra, with the cheapest at $3.00. <em>Choice of Sauce</em> was also required and cost at least $1.00. The required side and size choices had no-cost selections, but neither preparation nor sauce could be declined${cite('m-brothers-plate')}.</p>

${priceLadder({
  advertised: 12.0,
  was: 18.0,
  steps: [
    {
      label: 'Choice of preparation',
      amount: 3.0,
      forced: true,
      note: 'Marked "Required — Choose 1". The cheapest three options each add $3.00. A fourth adds $12.00. There is no $0 option.',
    },
    {
      label: 'Sauce',
      amount: 1.0,
      forced: true,
      note: 'Also marked "Required". There is no option to decline it.',
    },
  ],
  caption:
    'Chargrill Kebab Plate at M Brothers Cafe & Restaurant, checked 15 September 2026. The linked listing may change. This records the displayed price and required choices at that check; it does not establish who configured the options or promotion.',
})}

<p>At this check, no valid selection of the item produced a $12.00 item price. The required preparation and sauce added at least $4.00, making the lowest selectable item price <strong>$16.00</strong>${cite('m-brothers-plate')}.</p>

${callout(
  'The arithmetic',
  `<p>Advertised: <strong>$12.00</strong>. Lowest selectable item price: <strong>$16.00</strong>. The required extras add <strong>33%</strong> to the displayed price, before a single fee is charged.</p>
   <p class="u-flush">The tile also showed a <strong>33% off</strong> badge, calculated from the displayed $18.00 and $12.00 figures${cite('m-brothers-plate')}. This check did not establish the former total price with the same required choices, so it does not calculate an effective discount.</p>`,
  'key'
)}

<h2 id="pickup">Why delivery fees are not the explanation</h2>

<p>The usual defence of food delivery pricing is that delivery costs money &mdash; riders, insurance, support, the app itself &mdash; and that the fees at checkout cover it. Whatever you make of that argument, it cannot explain this one.</p>

<p>Ub*r e*ts offers <strong>pickup</strong> instead of delivery. Its fee guidance says pickup orders are exempt from delivery and service fees${cite('pickup-fees')}. You collect the food yourself, avoiding those delivery-related charges.</p>

<p>Pickup does not remove the item's required $3.00 preparation choice or $1.00 sauce. Those costs remain attached to the plate${cite('m-brothers-plate')}.</p>

${compareTotals({
  left: {
    title: 'What the listing promises',
    lines: [
      { label: 'Advertised item price', amount: 12.0 },
      { label: 'Delivery fee (pickup)', amount: 0 },
      { label: 'Service fee (pickup)', amount: 0 },
    ],
    note: 'The price a customer would reasonably expect to pay when collecting the order themselves.',
  },
  right: {
    title: 'Lowest selectable item price',
    lines: [
      { label: 'Advertised item price', amount: 12.0 },
      { label: 'Required preparation choice', amount: 3.0 },
      { label: 'Required sauce', amount: 1.0 },
      { label: 'Delivery fee (pickup)', amount: 0 },
      { label: 'Service fee (pickup)', amount: 0 },
    ],
    note: 'The item subtotal with the cheapest required choices. This is not a final checkout quote.',
  },
  caption:
    'Pickup removes delivery and service fees, but not these required item choices. The $4 gap is in the item subtotal, before any other checkout charges.',
})}

<p>In our view, a $12.00 menu tile could leave a misleading impression for this item as configured at the check: even when pickup removes delivery and service fees, the lowest selectable item price was still $16.00${cite('m-brothers-plate')}.</p>

<h2 id="pattern">What one listing shows</h2>

<p>One listing does not establish how often this happens. It does show a specific gap: the item appeared at $12.00, while required choices made its lowest selectable price $16.00${cite('m-brothers-plate')}.</p>

<p>The ACCC says a displayed minimum price should include unavoidable extra costs, and describes gradually added charges as <strong>drip pricing</strong>${cite('accc-price-displays')}. Whether that guidance applies to these item choices, and who is responsible for the listing, still needs legal analysis.</p>

${callout(
  'What the evidence does not settle',
  '<p class="u-flush">This documented price gap does not establish who configured the item choices, how often the pattern appears, or whether a court would find a breach of Australian Consumer Law. The linked item may have changed since the recorded check. Readers can inspect the sources and <a href="/about/">method</a> behind the comparison.</p>',
  'caution'
)}
`),
}
