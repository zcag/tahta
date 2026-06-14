# Contributing to tahta

```bash
npm install
npm run dev      # live-edit the example deck
npm test         # token-contract + AA-contrast gates (must pass)
npm run grade    # render every layout across all variants + report
```

## The one rule

**Components and layouts read only semantic tokens** — never a hardcoded color, font, radius, or `text-Nxl` size. `npm test` enforces this. Type sizes are `--fs-*` (via `.fs-*` classes), measures are `--mw-*`. This is what lets a variant restyle everything.

## Add a variant

1. Copy a `:root[data-variant='…']` block in `packages/theme/styles/tokens.css` and change the semantic values. The accent ramp + chart palette derive automatically from `--accent`.
2. Add an entry to `packages/theme/variants.json`.
3. `npm test` — the AA-contrast gate will tell you if `--fg`/`--fg-dim`/`--accent` don't pass on your background. Adjust until they do.
4. Optional: a structural flourish goes in `styles/index.css` keyed on `:root[data-variant='…']`.

## Add a layout

1. `packages/theme/layouts/<id>.vue` — delegate to `<SlideFrame>` for the shared chrome; read fields via `useSlideContext().$frontmatter`.
2. Add it to `packages/theme/layouts.json` (id, useFor, fields, example).
3. Add `<id>` to the layout lists in **both** READMEs (`README.md` and `packages/theme/README.md`).
4. Add a slide to `examples/gallery/slides.md` — this feeds the live explorer on tahta.cagdas.io.
5. `npm run docs` — regenerates `AGENTS.md` from the manifest (never edit `AGENTS.md` by hand).
6. `npm test` — the sync gate fails until steps 2–5 are done; `npm run grade` to eyeball across variants.

## Add a component

1. `packages/theme/components/<Name>.vue`. Internal plumbing (not author-facing, e.g. `SlideFrame`) goes in the `INTERNAL` allowlist in `scripts/check-sync.mjs`; everything else is part of the contract.
2. Add it to the `components` array in `packages/theme/layouts.json` (name, useFor, props, example).
3. Add `<Name>` to the component list in `packages/theme/README.md`.
4. `npm run docs`, then `npm test`.

## Don't let it drift

`npm test` runs `scripts/check-sync.mjs`, which **fails the build** if any layout / component / variant exists in code but is missing from `layouts.json`, the generated `AGENTS.md`, the READMEs, or the gallery showcase. And `npm run deploy` rebuilds tahta.cagdas.io from `examples/*` automatically (decks are auto-discovered). So an addition can't silently skip the docs, examples, or site — the gate is the reminder.

## Stability

`themeConfig` keys, `layouts.json`, `variants.json`, and `tokens.json` are the public contract — changes there follow semver (additions = minor, removals/renames = major). Internal token *values* may shift between minors; token *names* in `tokens.json` won't without a major.

## Boundary

`packages/grade` (the `tahta` CLI) is a dev-only tool, never a runtime dependency of the theme — it's marked `"private": true` and is **not** on npm. The theme is the opposite: `slidev-theme-tahta` **is published to npm** and that's how consumers (e.g. [tela](https://tela.cagdas.io), which pins it) pick up changes. Don't conflate the two.

## Releasing the theme

`npm run deploy` only rebuilds the **site** (tahta.cagdas.io) — it does *not* ship the theme. To release `slidev-theme-tahta`:

1. Bump `version` in `packages/theme/package.json` and add a `CHANGELOG.md` entry.
2. `npm test` (the sync/contrast/lint gates), then commit as `release(theme): <version> — <summary>`.
3. `cd packages/theme && npm publish` (public; you must be logged in as a maintainer). Consumers then `npm update slidev-theme-tahta`.
