import { hero, section, cards } from '../templates/components.js'
export const page = {
  slug: '', order: 0, title: 'Home', description: 'Placeholder',
  render: ({ cite }) => hero({ title: 'Placeholder', lede: 'Build pipeline test.' }) +
    section(`<p>Testing citations${cite('placeholder')}.</p>` + cards([{ href: '/riders/', title: 'Riders', body: 'Test' }])),
}
