import { hero, section } from '../templates/components.js'
export const page = {
  slug: 'the-law', order: 9, title: 'the-law', description: 'Placeholder',
  render: () => hero({ title: 'the-law' }) + section('<p>Placeholder.</p>'),
}
