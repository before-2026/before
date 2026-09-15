import { hero, section } from '../templates/components.js'
export const page = {
  slug: '404',
  order: 99,
  title: 'Page not found',
  description: 'That page is not here.',
  render: ({ site }) =>
    hero({
      eyebrow: 'Error 404',
      title: 'That page is not here',
      lede: 'The link may be old, or the page may have been renamed. Everything on the site is one click away below.',
    }) +
    section(`
<ul class="u-list-sm">
  ${site.nav
    .map(
      (n) =>
        `<li><a href="/${n.slug}/" class="u-plain">${n.label}</a></li>`
    )
    .join('\n  ')}
</ul>
<p class="u-mt2"><a class="btn" href="/">Back to the start</a></p>`),
}
