import { hero, section } from '../templates/components.js'
export const page = {
  slug: 'competition', order: 9, title: 'competition', description: 'Placeholder',
  render: () => hero({ title: 'competition' }) + section('<p>Placeholder.</p>'),
}
