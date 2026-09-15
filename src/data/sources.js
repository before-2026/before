// Citation registry. Every factual claim on the site points at a key in here.
// Rules: primary sources preferred; url must be one that actually loads;
// `date` is the publication date when known, or the check date for a live listing.
export const SOURCES = {
  'm-brothers-plate': {
    title: 'Chargrill Kebab Plate — M Brothers Cafe & Restaurant item listing',
    publisher: 'Ub*r e*ts',
    url: 'https://www.ubereats.com/store/m-brothers-cafe-%26-restaurant/qVGWlxE1RiyGGnVNOJoxsg/5a004b41-ef08-5b3c-a999-c265c96e3cae/0379a62a-1156-4ddb-a09a-7e1dc45d5dfb/82449fbd-29d8-5da0-a0f8-fe90ff23da6d',
    date: 'Checked 15 September 2026',
    type: 'company',
  },
  'pickup-fees': {
    title: 'Guest Checkout FAQ — fees on pickup orders',
    publisher: 'Uber Help',
    url: 'https://help.uber.com/en/ubereats/restaurants/article/guest-checkout-faq?nodeId=55360f16-19bf-4c45-a411-5e2e9a47be1d',
    date: 'Checked 15 September 2026',
    type: 'company',
  },
  'accc-price-displays': {
    title: 'Price displays — minimum total cost and drip pricing',
    publisher: 'Australian Competition and Consumer Commission',
    url: 'https://www.accc.gov.au/business/pricing/price-displays',
    date: 'Checked 15 September 2026',
    type: 'regulator',
  },
}
