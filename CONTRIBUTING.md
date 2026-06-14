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
3. `npm run docs` — regenerates `AGENTS.md` from the manifest (don't edit `AGENTS.md` by hand; it's generated).
4. Add a slide to `examples/gallery` and `npm run grade` to verify across variants.

## Stability

`themeConfig` keys, `layouts.json`, `variants.json`, and `tokens.json` are the public contract — changes there follow semver (additions = minor, removals/renames = major). Internal token *values* may shift between minors; token *names* in `tokens.json` won't without a major.

## Boundary

`packages/grade` (the `tahta` CLI) is a dev-only tool, never a runtime dependency of the theme.
