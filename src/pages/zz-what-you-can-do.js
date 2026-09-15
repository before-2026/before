import { hero, section } from '../templates/components.js'
export const page = {
  slug: 'what-you-can-do', order: 9, title: 'what-you-can-do', description: 'Placeholder',
  render: () => hero({ title: 'what-you-can-do' }) + section('<p>Placeholder.</p>'),
}
