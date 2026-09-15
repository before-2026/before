import { hero, section } from '../templates/components.js'
export const page = {
  slug: 'restaurants', order: 9, title: 'restaurants', description: 'Placeholder',
  render: () => hero({ title: 'restaurants' }) + section('<p>Placeholder.</p>'),
}
