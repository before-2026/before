# beforeubereats.com

An independent Australian site examining one documented food-delivery price display:
a menu item shown at A$12 whose required choices made the lowest selectable item
price A$16 at the recorded check.

Static HTML. No dependencies, no build tooling to install, no tracking, no cookies,
no third-party requests on page load.

---

## Quick start

```bash
node build.mjs      # generates dist/
node server.mjs     # preview at http://localhost:4321
```

Node 20 or newer. There is nothing to `npm install` — the generator is plain Node.

| Command | What it does |
| --- | --- |
| `npm run build` | Generate `dist/` |
| `npm run check` | Validate pages and citations without writing files |
| `npm run serve` | Build, then preview on `localhost:4321` |

---

## How the site is put together

```
src/
  data/sources.js     Every citation, keyed. The single source of truth for references.
  data/site.js        Site name, nav order, review date.
  pages/*.js          One module per page, exporting `page = { slug, title, render }`.
  templates/          layout.js (the HTML shell) and components.js (reusable blocks).
  assets/             styles.css, site.js, favicon.svg — copied verbatim into dist/.
build.mjs             The generator.
```

**Citations are the important part.** A page calls `cite('key')` inline; the build
collects the keys in order of first appearance, numbers them, and renders a numbered
reference list at the foot of that page. Cite an undefined key and **the build fails**.
The build cannot tell whether an uncited factual sentence needs a source; that still
requires editorial review.

```js
`The required sauce added at least A$1${cite('m-brothers-plate')}.`
```

To change a claim's source, edit `src/data/sources.js` in one place.

`npm run check` also fails on sources missing a title or a non-absolute URL, and warns
about sources that are defined but never cited.

---

## Deploying to GitHub Pages

### GitHub Actions

The repository is `before-2026/before`. Its workflow file is
`.github/workflows/nextjs.yml`; despite the inherited filename, it builds this
plain-Node site and uploads `dist/`.

In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
Committing an edit to `main` runs the build and deployment. A branch source such as
`main` → `/docs` does not contain this generator's output.

### Custom domain

For an Actions deployment, set `beforeubereats.com` in **Settings → Pages → Custom
domain**; GitHub ignores the repository's `CNAME` file for this setting. Then at
your DNS provider, create:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `before-2026.github.io` |

Once GitHub's DNS check and certificate complete, tick **Enforce HTTPS**. DNS and
certificate setup can take up to 24 hours.

> Confirm the apex IP addresses against GitHub's current documentation before you
> rely on them — GitHub has changed them before.

If you are not using a custom domain, delete `CNAME` and set
`site.origin` in `src/data/site.js` to `https://YOUR-USERNAME.github.io/REPO-NAME`.
Note that a project site served from a subpath will also need the root-absolute asset
paths in `layout.js` adjusted.

---

## Editorial rules

These are the site's editorial standards; see `/about/` for the method and recorded
limits of the A$12 example.

1. **Support each factual claim.** The build validates citation keys; editorial
   review checks whether a claim has adequate support.
2. **Prefer primary sources.** This example links the item listing and official
   platform and ACCC guidance.
3. **State the date a figure applies to.** Where something has changed, say what it
   was and what it is now.
4. **Do not overstate.** If a source supports a weaker claim, make the weaker claim.
   Avoid absolutes and avoid words implying criminality.
5. **Separate fact from opinion,** and label opinion as opinion.
6. **Consider corrections and responses** when the listing or relevant guidance
   changes.
7. **Own assets only.** No third-party photographs, no company logos, no app
   screenshots. Every graphic here is original CSS or SVG.
8. **Correct promptly and visibly.** See the corrections policy on `/about/`.

## Licence

Site content: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Code: MIT.
