# Changelog

All notable changes to `slidev-theme-tahta`. Follows [semver](https://semver.org); the public contract is the `themeConfig` keys, the layouts/components in `layouts.json`, the variants in `variants.json`, and the semantic tokens in `tokens.json`.

## 0.11.2
- **Rule 8 (the slide-separator rule) rewritten so it stops misleading agents on body-less slides.** The old "slides are separated by a single `---`" — read literally for the common all-frontmatter slide — produces the shared-fence bug: bare `layout:`/`title:` keys after a single `---` with no opening fence, which Slidev renders as body text and mis-parses the rest of the deck (observed in the wild: a whole deck that 404'd on Present). Rule 8 now states the real contract — every slide's frontmatter is fenced `---`…`---`, the separator *is* the next slide's opening fence, so two body-less slides correctly show two `---` lines between them — and names both failure modes (sharing one fence; a stray `---` after a body). `lint.mjs` already errors both. Docs-only; no API change.

## 0.11.1
- **Branding model clarified: brand = accent + logo, not the variant.** `modules/branding.md` no longer couples the brand to a variant or maps brand types to specific variants (which led agents to converge on the same few). The brand through-line is the accent (hue-matched) + logo, which ride on *any* variant; the `variant` stays a deliberate per-deck choice for the deck's content and occasion. Docs-only; no API change.

## 0.11.0
- **Accent override now keeps the hue, normalized into the variant.** A `themeConfig.accent` brand color comes in as `--brand`; its lightness/chroma are clamped into a per-variant envelope (`--accent-l-lo/-hi`, `--accent-c-hi`) and the whole palette — `--on-accent` (contrast-picked), chart `--cat-*`, tints/shades — re-derives from the normalized accent. So an arbitrary brand color stays legible and on-style instead of clashing; only the hue carries through, **not the exact hex**. The contrast gate now fuzzes the hue wheel through every envelope to prove on-accent AA for any override. Dropped the dead `--accent-2` token.
- **Branding (logo slot) + the capability-module pattern.** New `themeConfig.logo` (+ `logoInvert`): a `<BrandLogo>` renders a hero logo on openers (cover/section/lead/end) and a small footer mark on content slides (`mark: false` to opt out). Introduces **optional capability modules** — prompt fragments in `modules/` (with a `modules.json` manifest) that a consumer appends to `AGENTS.md` only when relevant, keeping the core lean. First module: `modules/branding.md`.
- **Imagery module + treat tool.** `modules/imagery.md` encodes the imagery recipe (imagery for atmosphere/concept/focal only; reuse one background; rich on-palette prompts; raw by default, duotone as a fallback; isolate focal subjects on the variant ground). Ships `tahta-imagine` (bin + `imagine.mjs`) — a deterministic treat step (crop → scheme-aware duotone → grain → optional scrim) that reads each variant's palette from the theme's own tokens; `sharp` is an optional dependency. tahta still never generates images — the operating agent does.
- **Feather on the `image` split seam.** The focal image dissolves into the body ground instead of a hard vertical cut (a `--feather` token, default 13%; set `0` for a crisp editorial edge).

## 0.10.7
- **Fix: the `lead` opener clipped its title off the top.** `lead` was the one title layout never wrapped in `<Fit>` when auto-fit shipped in 0.10.3 (which only covered cover/section/statement/end) — so a long `lead` title had no shrink-to-fit at all, and because the layout is bottom-anchored (`justify-content:flex-end`) the overflow spilled off the *top*. `lead` now wraps its content in `<Fit>` inside a full-height absolute box (mirroring `cover`’s `.l-center`), staying bottom-left when it fits and scaling down — top-aligned, from the top-left — when the title is too tall. This was the layout behind the clipped first slide on embedded SPA renders.

## 0.10.6
- **Fix: cover/section titles still clipped on an embedded SPA renderer (e.g. tela), even after the `<Fit>` wrapping in 0.10.3–0.10.5.** Root cause was `<Fit>`’s height measurement, not the wrapping: it read `available` from its own `height:100%` box (`outer.clientHeight`), which is correct under Slidev’s definite-height canvas but gets *inflated* when a host SPA leaves the percentage-height chain unresolved — so `<Fit>` thought the title fit, kept it vertically centered at scale 1, and the host’s fixed-aspect frame clipped the top. `<Fit>` now also derives the height from the real visible frame (the `.slidev-layout` box, which has `overflow:hidden` + a definite height) and takes the smaller of the two, all in transform-immune layout pixels — so it scales down correctly regardless of host. It additionally re-fits on `requestAnimationFrame` and `document.fonts.ready`, closing a one-shot-render race where a web font swaps in (and reflows the title taller) after the initial measure. No-op for slides that already fit; verified identical scale to before across Slidev dev + export at multiple canvas widths.

## 0.10.5
- **Overflow signal: when a slide is so dense it spills even at `<Fit>`’s min scale (0.42), say so.** `<Fit>` now emits a one-shot `console.warn` (visible in `slidev dev`/export logs) and sets `data-fit-overflow` on the frame — an author cue to split or trim the slide. The `tahta-grade --checks` overflow gate now trusts that attribute where a `.fit` governs sizing (a `transform: scale()` doesn’t shrink `scrollHeight`, so the raw scroll metric would otherwise false-flag every healthy scaled slide).

## 0.10.4
- **Fix: dense slides (big tables, full glossaries) overflowed the bottom — the `<Fit>` auto-shrink never actually fired.** Two bugs compounded: (1) `.l-body` / `.fit` are flex items with the default `min-height: auto`, so a tall body *grew the container to its own height* instead of being capped — `<Fit>` then measured `available ≈ content` and computed scale 1, so its shrink path was effectively dead code. Added `min-height: 0` so the container holds the frame height and `<Fit>` sees the real overflow. (2) Once scaling actually fires, `<Fit>` centered the content on its *unscaled* (taller) box — a CSS `transform: scale()` doesn't change layout size — so shrunk content bled upward into the title. `<Fit>` now top-aligns whenever it's scaling (origin is already top), so content shrinks within its frame instead of overlapping the header or the footer.

## 0.10.3
- **Fix: long cover/section titles could clip off the top of the slide.** The cover, section, statement and end layouts centered their title with `position:absolute; inset:0` and no overflow guard, so a title that wrapped past the frame height was simply cut off (worse on renderers with a larger base scale than Slidev's canvas, e.g. an embedded SPA). These layouts now wrap their title block in `<Fit>` — the same auto-shrink already used by every content layout — so an oversized title scales down to fit instead of clipping. Titles that already fit are untouched (scale stays 1).

## 0.10.2
- **Fix: charts could render blank on a slide that wasn’t active at mount** (echarts `Can’t get DOM width or height` on a 0×0 container). `<Plot>` now lazily inits + paints via a `ResizeObserver` once the container has size, and re-fits on resize.

## 0.10.1
- **Fix: brutalist entrance motion was choppy.** `--motion-ease` was `steps(2, end)` (a literal 2-frame stepped easing that read as broken, not “mechanical”); now a sharp-but-smooth `cubic-bezier(0.2,0,0,1)`.

## 0.10.0
A best-of-the-best variant revamp — decomposed the strongest themes from Gamma, Keynote, PowerPoint, and Pitch, added two system upgrades that make *every* variant render richer, then built six new variants faithful to specific references (two QA render rounds each).

- **System — themed data palettes.** Each variant now defines a deliberate 5-swatch chart ramp (`--cat-*`) instead of tints of one accent — the biggest "looks designed" multiplier (the move PowerPoint and Gamma both lead with). Charts, donuts, and role-colored cards all draw from it. The derived-from-accent ramp stays as the fallback for custom accents.
- **System — role-color cards.** `panels` / `feature` / `columns` cards cycle a distinct hue from the ramp across border, top-tick, icon, and heading (the Gamma "every card its own color" signature), via CSS `nth-child` on the grid child.
- **Six new variants (7 → 13):** `lagoon` (dark teal + pastel role-cards — Gamma Lagoon), `press` (B&W editorial magazine, Fraunces serif + red spot — Pitch Editorial), `boardroom` (navy + warm-orange corporate — PowerPoint Hexagon), `signal` (true black + electric cyan + glow — Keynote Standard Minimalist), `muse` (muted stone ground + heavy serif — Keynote Scientific Muted), `poster` (cream + Anton condensed + hot accent — Pitch Sports). Adds the `Anton` font.
- **Gate fixes.** `check-contrast` and `gen-assets` now derive the variant list from `variants.json` (were hardcoded to 7), so every new variant is AA-gated and montaged automatically. `lint` also gained empty-slide + duplicate-frontmatter-key checks and a `tahta-lint` CLI (see 0.9.0).

## 0.9.0
Authoring is now a deliberate, self-validating flow — the agent makes (and surfaces) design decisions instead of coasting on defaults, and `lint` blocks decks that look fine but won't ship.

- **`themeConfig.variant` is now required.** `tahta-lint` errors if a deck omits it — no silent default at author time (the theme still renders `editorial` if truly unset). Each variant gains a **`best for`** (tone/audience) in `variants.json`, surfaced in `AGENTS.md`, so the choice is informed; the contract tells the agent to state which variant it chose and why, and that it's switchable. **Breaking (pre-1.0):** existing decks without `themeConfig.variant` now fail `lint` (add one).
- **`lint` catches two more ship-blockers:** an **empty slide** from a stray `---` separator (renders blank), and a **duplicate frontmatter key** — e.g. a deck-level `title` and the first slide's `title` in the same opening block, which lints clean under `@slidev/parser` but fails `slidev export` with `DUPLICATE_KEY`. "Lints clean" now implies "will render".
- **`tahta-lint` CLI** — the linter ships as a `bin`, so `npx tahta-lint slides.md` is a one-command pre-flight for authoring agents and CI. The theme's `lint()` is the single source of truth; the grade CLI and the agent-QA harness reuse it (no parallel implementation).
- **Richer composition guidance** — rules now bias toward composing components *liberally and with variety* (a content→component map: number→`<Stat>`, status→`<Badge>`, stack→`<Tags>`, person→`<Person>`, …) on `default`/`two-cols`/`statement` canvases, plus the single-`---` separator rule.

## 0.8.0
- **New components** — `<Figure>` (image/diagram + caption + credit — the basic figure primitive), `<Meter>` (labeled progress bar, tone-aware), `<Person>` (avatar + name + role; initials fallback), `<Tags>` (keyword chips). All tokenized + showcased in the gallery.
- **Breaking (pre-1.0):** the asymmetric hero-number layout `figure` is renamed **`metric`** (so `<Figure>` can mean image+caption, the publishing sense). Update `layout: figure` → `layout: metric`.
- The gallery catalog now showcases every author-facing component (Callout/Badge/Icon + Figure/Meter/Person/Tags), and the sync gate enforces component coverage — not just layouts.

## 0.7.0
Two big additions: **editorial composition** (so decks have rhythm, not sameness) and a **teaching/technical pack** (so tahta serves talks & docs, not just pitches).

- **New editorial layouts** — `lead` (asymmetric opener, title low-left + ghost numeral), `bigtype` (full-bleed type, auto-fits), `figure` (giant number + context, vs the centered `fact`).
- **`<em>` emphasis** — `<em>word</em>` in a title sets a true italic in the accent color (gorgeous in Fraunces) — the designed-headline lever beyond a flat `accent2` color span. Plus **drop caps** via `class: dropcap` and a wider type scale.
- **Teaching/technical pack** — layouts `agenda`, `define`, `columns`, `panels`, `reference` (cheatsheet), `vs`, `code-explain`; components `<Kbd>`, `<Terminal>`, `<FileTree>`. All tokenized → restyled by every variant, AA-gated.
- **New example deck** `teach` (Claude Code 101) showing the whole technical pack; `talk` rebuilt to demonstrate composition rhythm.
- 30 layouts + 12 components, all documented in `layouts.json` / `AGENTS.md`; `lint` validates the new layouts and `figure.value`.

## 0.6.1
- **`lint` catches leaked / unclosed frontmatter** — a slide whose body starts with frontmatter keys (the classic "forgot the closing `---`", which Slidev then renders as prose) is now flagged. `lint` uses Slidev's own parser when available, so it sees the exact slide bodies the renderer does (falls back to the lighter regex path otherwise).
- **Footer no longer prints raw HTML** — a deck `title` (or per-slide `foot:`) containing accent markup like `<span class="accent2">…</span>` now renders as clean text in the footer instead of literal tags.

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
