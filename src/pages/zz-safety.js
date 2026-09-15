import { hero, section } from '../templates/components.js'
export const page = {
  slug: 'safety', order: 9, title: 'safety', description: 'Placeholder',
  render: () => hero({ title: 'safety' }) + section('<p>Placeholder.</p>'),
}
