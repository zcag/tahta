# Changelog

All notable changes to `slidev-theme-tahta`. Follows [semver](https://semver.org); the public contract is the `themeConfig` keys, the layouts/components in `layouts.json`, the variants in `variants.json`, and the semantic tokens in `tokens.json`.

## 0.6.0
- **Per-slide background slot** — a universal `bg:` frontmatter field on every layout. Generated, asset-free, accent-derived backgrounds: `mesh` · `aurora` · `grain` · `dots` · `grid` (drawn from CSS gradients + the shared noise SVG via OKLCH — deterministic on export, zero licensing, can't break the AA gate). `bg:` also accepts an image path/URL, painted under an automatic contrast scrim so text stays AA-legible. Rendered in-layout (works in dev / print / export) via a `<SlideBg>` primitive; documented in `layouts.json` → `universal`.
- `lint.mjs` validates `bg` (warns on a value that's neither a known name nor an image path) and stopped false-flagging `routerMode`.

## 0.5.0
- **`lint.mjs`** — a structural validator exported from the package (`slidev-theme-tahta/lint.mjs`): unknown layout, missing/unknown fields, enum & type mismatch, value-not-bare, bad variant. For consumers (e.g. an MCP `lint_deck` tool). Optional `yaml` dep for the markdown path.
- **Per-component examples** in `layouts.json` (surfaced in `AGENTS.md`).
- **Live theming** — `global-bottom` listens for `postMessage({tahtaVariant})`, so an embed can switch variant with no reload (used by the tahta.cagdas.io explorer).

## 0.4.0
- URL overrides `?variant` / `?accent` / `?lang` (shareable variant URLs).
- tahta.cagdas.io site; broadened npm keywords.

## 0.3.0
- **`tokens.json`** — the semantic token layer is now a documented public contract (foundations for theming/overrides). Bound to `styles/tokens.css` by the token-contract test.
- **AA-contrast gate** — `npm test` now statically verifies every variant's `--fg`/`--fg-dim`/`--accent` meet WCAG AA against its background. The build fails otherwise.
- Governance: `CHANGELOG.md`, `CONTRIBUTING.md`.
- README repositioned around the design system (variants are a proof point, not the pitch).

## 0.2.0
- **3 new variants** — `paper` (warm rust serif), `atelier` (gradient titles), `notebook` (ruled paper). 7 total.
- **Semantic color roles** — `--good/--warn/--bad/--info`; `Callout` tone, `Badge`, per-stat `tone`.
- **Turkish / i18n** — `themeConfig.lang` drives correct locale casing on kickers.
- **Machine-readable contracts** — `layouts.json` + `variants.json`; `AGENTS.md` generated from them.
- Capability: Magic-Move `code` layout; charts gain line/area/donut with a one-hue OKLCH palette; `timeline`/`logos`/`embed`/`showcase` layouts; `Fit` auto fit-to-frame.

## 0.1.0
- Initial release: token-driven theme, 4 variants (editorial/brutalist/soft/minimal), declarative frontmatter layouts, components, motion.
