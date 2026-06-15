# tahta — feature roadmap & design intent

> Captured direction for where the system grows next. Companion to
> [`notes-from-tela.md`](notes-from-tela.md) (richness + QA loop). This file is the
> single place that holds the *intricacies* so they don't get lost between sessions.

The throughline: **tahta is a render contract + baked-in design taste.** It supplies
tools and context to the *operating agent* (the agent authoring a deck — e.g. tela's
MCP flow, or a CLI agent). It never grows a runtime: it does not call models, hold API
keys, or generate assets. Everything below respects that line.

---

## 1. Capability modules — the architecture

`AGENTS.md` is generated from `layouts.json` + `variants.json` and **served verbatim**
by tela (with a tiny preamble). It is token-paid by every consumer on every render.
So new capabilities must **not** bloat the core contract.

Instead: **capability-gated prompt modules.** Each optional feature ships as its own
generated fragment that a consumer appends *only when that capability is present in the
run*:

- **Core contract** (always served): layouts, components, variants, rules. Stays lean.
- **Optional modules**: `branding.md`, `imagery.md`, later maybe `pacing.md`,
  `data-viz.md`. Appended when brand info was supplied / an image tool is available / etc.

This generalizes tela's existing "prepend a preamble" trick rather than inventing a new
mechanism. Each module is independently testable via the QA loop in `notes-from-tela.md`
(fire an uninstructed agent *with* and *without* the module, diff the behavior).

**Build order:** accent system first (foundation — must be solid before anything layers
brand color on top), then branding, then imagery.

---

## 2. Accent system — "clever accent" (IMPLEMENTED)

> Shipped: envelope in `tokens.css`, JS routing in `global-bottom.vue`, hue-fuzz in
> `check-contrast.mjs` (+ `scripts/lib/oklch.mjs`), contract in `layouts.json`/`tokens.json`.
> Validated: `npm test` green; muse + hostile cyan/magenta overrides render coherent (hue
> kept, energy tamed, on-accent legible, cats harmonious). **Not yet built:** the
> `accentExact` escape hatch (below) — deferred as the obvious next small step.


### The problem
Overriding `themeConfig.accent` with an arbitrary brand color can make a deck "suddenly
ugly". Root causes, all mechanical, found in `tokens.css`:

1. **`--on-accent` is hardcoded per variant** (`#fff`/`#000`/`#07211d`…). Override the
   accent to a light color on a variant whose `--on-accent: #fff` → unreadable text on
   accent fills. Contrast break.
2. **`--cat-2..5` are hand-tuned hex per variant.** Only `--cat-1` follows the accent.
   Override → series 1 clashes with the stale series 2–5. Palette break.
3. **Nothing tames the raw input.** A neon dropped on a muted/cream ground (`muse`,
   `paper`) is too loud for that ground — right hue, wrong energy.

(The base `:root` block *already* derives `--cat-2..5` and `--accent-deep/-soft` from
`--accent` via OKLCH — variants just override the cats. So the derived fallback exists.)

### The design: variant owns an *envelope*, user owns a *hue*
When someone pastes a brand hex, the thing they care about is the **hue**. Lightness and
chroma belong to the *variant* — they're what make `muse` restrained and `signal`
electric. So: **keep the user's H, clamp L and C into the variant's envelope, derive
everything from the normalized result.**

Per variant, new envelope tokens (data):
- `--accent-base` — the variant's designed accent (= today's hardcoded `--accent`).
- `--accent-l` clamp range (L min/max) and `--accent-cmax` (chroma ceiling).

Then in the base block (computed once, reads the per-variant envelope vars):
```css
--accent: oklch(from var(--brand, var(--accent-base))
                clamp(<lmin>, l, <lmax>) min(c, <cmax>) h);
```
- **No override** → `--brand` unset → falls back to `--accent-base`, which is in-envelope,
  so the clamp is a **no-op**. Default decks render identically to today.
- **Override** → user's hue, variant's L/C. A neon on `muse` becomes a muted olive-green
  in the same hue family; it can't break the ground.

### Derive the rest — but only on override (preserve crafted defaults)
A trailing `:root[data-accent='custom']` block (set by JS only when an override exists;
last in source so it wins specificity ties with variant blocks):
- **`--on-accent` computed** by contrast off the normalized accent's L (dark accent →
  light text, light accent → dark). Kills the legibility break.
- **`--cat-1..5` switched to the accent-derived rotations** (the ones already in base),
  so the chart/card palette stays coherent with any accent.

Default decks keep their hand-tuned cats + deliberate `--on-accent` (cream on muse, etc.)
because `data-accent='custom'` is absent.

### JS (`global-bottom.vue`)
On override: set `--brand` (raw) + `root.dataset.accent = 'custom'` instead of writing
`--accent` directly. Clear both when no override. Same in the postMessage live-theming
path. (`--accent-2` handling is a secondary concern — left following brand for now;
note: `press` uses `--accent-2` structurally as a near-black, revisit.)

### Prove it with the gate we already have
`npm test` → `check-contrast.mjs` is static-hex only today; it also does **not** check
`--on-accent` against `--accent` (the break that bites). Extend it:
- add a minimal sRGB↔OKLCH converter (no dep; ~30 lines).
- **fuzz ~12 hues around the wheel** through each variant's envelope clamp; assert AA for
  fg/fg-dim on ink **and** computed on-accent on the normalized accent fill.
Now the envelope is *proven* safe for any override, not hoped — the tahta posture.

### Escape hatch
Default = normalized (pit of success). Add `accentExact: true` (or similar) to bypass the
clamp for users who want their exact brand color; the AA gate still runs and warns.

### Open judgment call (decided)
Hand-tuned `cat-2..5` are often *more distinct* than algorithmic rotation → keep
hand-tuned as default, switch to derived only on override. Best of both.

---

## 3. Branding module — v1 logo slot (IMPLEMENTED)

> Shipped v1 (scope: **logo slot only**, decided with the user): `themeConfig.logo` +
> `logoInvert`, a `<BrandLogo>` component (hero on cover/section/lead/end, small footer mark on
> content slides, `mark:false` opt-out), documented in the core contract, plus the first
> capability module `modules/branding.md` + the `modules/modules.json` manifest pattern.
> Brand color rides the hue-safe accent; **fonts stay the variant's** (the module picks the
> variant that fits). **Deferred:** brand font override + a 2nd locked brand color.

Original rationale below.

Strong fit — "take plain brand data → declarative theme choices", plays to the one-accent
→ whole-palette strength. It's **not only a prompt addendum**; it exposes real theme gaps
to fill first:
- a **logo slot** (cover + footer/corner placement; light/dark marks),
- **brand font injection** beyond each variant's baked typefaces,
- brand color → accent is easy (now envelope-safe); a brand needing **2–3 locked colors**
  (not one accent-derived ramp) is a token-system question.

Then a `branding.md` module teaches the agent to map brand inputs → `variant` + `accent`
+ logo + lang.

---

## 4. Imagery module (after branding) — tools + context ONLY

Boundary (decided): **tahta supplies taste + slot; the operating agent generates.** tahta
never calls an image model. It ships, as data/context:
- **per-variant image-style descriptors** (`press` → B&W editorial photography; `signal`
  → neon 3D renders; `notebook` → hand-drawn; etc.),
- **placement / aspect / scrim rules** (when `bg` vs `image` layout vs `<Figure>` vs
  `showcase`; aspect ratios per layout; the contrast-scrim that already exists).

The operating agent assembles those with the slide's content/style/need into the brief it
hands its own image-gen agent. Useful even with no image tool (choosing/placing existing
assets). Same module pattern as branding.

---

## 5. Validation method (applies to every module)
The `notes-from-tela.md` QA loop: uninstructed agent as the test subject → inspect the
decision stream → render → adversarial critique → fix the module → re-run and confirm the
behavior shifted. Plus the static gates (`npm test`) as the floor.
