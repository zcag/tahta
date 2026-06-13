# Tahta design system

A small, opinionated system: **tokens → components → layouts**, with **style variants** and a **grading** loop. Everything reads from semantic tokens, so one variant restyles the whole deck — type, shape, texture, density, palette.

## 1. Tokens (3-tier)

`packages/theme/styles/tokens.css`

- **Primitives** — raw scales: spacing (4/8pt), modular ratio, the grain texture.
- **Semantic** — what components actually read: `--ink`, `--fg`, `--accent`, `--font-display`, `--radius`, `--pad-x`, `--surface-bg`, `--chart-muted`, …
- **Variant bundles** — `:root[data-variant='…']` blocks that override the semantic layer.

Components/layouts must only reference semantic tokens — never hardcode a hex, radius, or font. (The one bug that slipped through, a hardcoded chart bar color, is exactly what this rule prevents — it became `--chart-muted`.)

## 2. Variants (style, not just color)

Set on the deck header; applied at runtime by `global-bottom.vue`. Defaults to `editorial`.

```yaml
themeConfig:
  variant: editorial   # editorial | brutalist | soft | minimal
  accent: '#7aa2ff'    # optional: override just the brand color
```

| variant | scheme | display type | shape | texture | feel |
|---|---|---|---|---|---|
| editorial | dark | Fraunces serif | hairline, r12 | grain | refined keynote |
| brutalist | dark | Space Mono | square, r0 | grid | technical/raw |
| soft | light | Plus Jakarta | round, r22 | none | friendly/product |
| minimal | light | Archivo heavy | hairline, r0 | none | Swiss/editorial |

### Add a variant
Copy a `:root[data-variant='x']` block in `tokens.css`, change the semantic vars. Done — every layout/component follows. If it needs a structural tweak (e.g. a different kicker decoration), add one `:root[data-variant='x'] .kicker::before {…}` rule in `index.css`.

## 3. Components

`packages/theme/components/` — auto-registered, token-driven, usable in any `default`/`statement` body.

- `Stat`, `StatCard` — big number + label (`value`, `unit`, `label`, `accent`)
- `BarChart` — ECharts wrapper (`categories`, `series`, `unit`); reads `--accent`, `--fg`, `--chart-muted`
- `Ghost` — oversized background glyph
- `Foot` — auto footer (deck title + auto page number); rendered by layouts

## 4. Layouts (declarative)

`packages/theme/layouts/` — pick one per slide, fill frontmatter. No HTML/CSS needed.

`cover` · `section` · `default` · `statement` · `quote` · `stats` · `compare` · `chart` · `steps` · `image` · `bleed` · `end`

Full schema + examples: `packages/theme/AGENTS.md`.

## 5. Grading

`packages/grade` (`tahta` CLI) is the inner loop. It exports every slide to PNG and runs three layers of check, then builds a side-by-side HTML report with a tab per variant:

1. **Blank / broken** (always) — near-uniform canvas, zero-dimension, too-few-colors.
2. **Visual regression** (`--baseline`) — pixel-diff vs an accepted baseline; flags drift and writes a diff image. `--update-baseline` to accept.
3. **Overflow + contrast** (`--checks`) — playwright measures clipped overflow (invisible in a PNG) and large-text contrast; decorative elements are excluded from the overflow measure.

```bash
tahta slides.md --variants editorial,brutalist,soft,minimal --serve 4180
tahta slides.md --watch                 # re-grade on save
tahta slides.md --update-baseline       # accept current render
tahta slides.md --checks                # + overflow/contrast
tahta slides.md                         # CI: non-zero exit if anything is flagged
```

Change a token → `tahta --watch` → see every slide in every variant update, with broken / regressed / overflowing slides flagged. Full reference: `packages/grade/README.md`.

## Architecture rule

Components and layouts read **only semantic tokens** — never a raw hex, font name, radius, or `text-Nxl` size. Type sizes are `--fs-*` tokens (via `.fs-*` classes), measures are `--mw-*`. This is what makes a variant able to re-scale type, and what made the one hardcoded value that slipped through (a chart bar color) a bug worth fixing into `--chart-muted`. The shared chrome (kicker · title · glow · ghost · footer) lives in one `SlideFrame` component, so a layout is ~3 lines and global changes happen once.
