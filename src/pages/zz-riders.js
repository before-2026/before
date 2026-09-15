import { hero, section } from '../templates/components.js'
export const page = {
  slug: 'riders', order: 20, title: 'Riders', description: 'Placeholder',
  render: () => hero({ title: 'Riders' }) + section('<p>Placeholder.</p>'),
}
