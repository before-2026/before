# beforeubereats.com

An independent, non-commercial, Australian public-interest site about the real costs of
food delivery platforms — for the riders, for the restaurants, and for the price you pay.

Static HTML. No dependencies, no build tooling to install, no tracking, no cookies,
no third-party requests of any kind.

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
reference list at the foot of that page. Cite an undefined key and **the build fails** —
this is deliberate, so an unsourced claim can never reach the published site.

```js
`Commission on the standard tier is 30% of the order value${cite('accc-2019')}.`
```

To change a claim's source, edit `src/data/sources.js` in one place.

`npm run check` also fails on sources missing a title or a non-absolute URL, and warns
about sources that are defined but never cited.

---

## Deploying to GitHub Pages

### Option A — GitHub Actions (recommended)

Already configured in `.github/workflows/deploy.yml`.

1. Create a repository on GitHub and push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/beforeubereats.git
git push -u origin main
```

2. In the repo, go to **Settings → Pages → Build and deployment**, and set
   **Source** to **GitHub Actions**.

3. Every push to `main` now rebuilds and deploys. No secrets or tokens needed.

### Option B — no Actions

Build locally and commit `dist/` to a `gh-pages` branch, or remove `dist/` from
`.gitignore` and point Pages at the `/docs` folder after renaming. Option A is less
fuss.

### Custom domain

The `CNAME` file contains `beforeubereats.com` and is copied into `dist/` on every
build. At your DNS provider, create:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `YOUR-USERNAME.github.io` |

Then **Settings → Pages → Custom domain**, enter the domain, and once the check
passes tick **Enforce HTTPS**. Certificate issuance usually takes a few minutes and
occasionally up to 24 hours.

> Confirm the apex IP addresses against GitHub's current documentation before you
> rely on them — GitHub has changed them before.

If you are not using a custom domain, delete `CNAME` and set
`site.origin` in `src/data/site.js` to `https://YOUR-USERNAME.github.io/REPO-NAME`.
Note that a project site served from a subpath will also need the root-absolute asset
paths in `layout.js` adjusted.

---

## Editorial rules

These are not style preferences. They are what keeps the site accurate and
defensible — see `/about/` on the site itself, and `LEGAL.md`.

1. **Every factual claim carries a citation.** The build enforces this.
2. **Prefer primary sources** — regulators, courts, legislation, coronial findings,
   government inquiries, peer-reviewed research, company filings — over news
   summaries. Never cite forums, blogs or aggregators for a fact.
3. **State the date a figure applies to.** Where something has changed, say what it
   was and what it is now.
4. **Do not overstate.** If a source supports a weaker claim, make the weaker claim.
   Avoid absolutes and avoid words implying criminality.
5. **Separate fact from opinion,** and label opinion as opinion.
6. **Include the company's response** where it has made one.
7. **Own assets only.** No third-party photographs, no company logos, no app
   screenshots. Every graphic here is original CSS or SVG.
8. **Correct promptly and visibly.** See the corrections policy on `/about/`.

## Licence

Site content: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Code: MIT.
