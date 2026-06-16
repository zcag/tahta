# tahta — imagery module

> Appended to the core authoring contract when the run can generate or place images. tahta
> never generates images itself — it gives you the taste, the slots, and a deterministic
> treat step. You bring the image model. Author slides exactly as AGENTS.md says; this governs
> **what** imagery to make, **where** it goes, and **how** to keep it on-brand.

The one line: **rich → reused → raw → rare.** Atmosphere lives in one shared image, substance
lives in layouts, and a couple of on-palette focal moments do the rest.

## 1. Most slides get NO image
Imagery does exactly three jobs. Everything else is substance — carry it in layouts/components,
not pictures (a generated image behind real content is almost always worse than the right
layout: a flow is `steps`, a comparison is `vs`, numbers are `stats`, a definition is `define`,
commands are `<Terminal>`). The three jobs:
- **Atmosphere** — `cover` and `section` backgrounds (set mood, don't inform).
- **Concept** — at most one metaphor slide.
- **Focal subject** — one `image` split with a real thing.

Over-imagery is the #1 way a deck reads as generic. When unsure, don't add an image.

## 2. Reuse ONE background
For *atmospheric* backgrounds, generate **one** image and reuse it across the cover and every
section divider (`bg: /deck-bg.jpg` on each). The repetition reads as a cohesive backdrop;
a different background on every slide reads as noise. Unique images are only for the concept
slide and the focal split.

## 3. The slots
- **`bg:` (cover / section / statement / any layout)** — full-bleed background. The theme paints
  an automatic contrast scrim, so text stays legible. This is the home of the reused background.
- **`image` layout** — a focal subject beside text (`image:`, `side: left|right`). The seam is
  feathered (image dissolves into the ground). Isolate the subject on the variant's ground color
  so it melts in (see §5).
- **`bleed` layout** — an edge-to-edge moment (`image:`, optional `stat`/`title`). `duotone: true`
  applies the accent treatment; default it **off** and keep the image raw unless it's off-palette.
- **`<Figure>`** — an inline image with caption.

## 4. Generate well — the quality recipe
This is what separates a premium deck from a flat one:
- **Rich, specific, detailed prompts.** Describe a real scene with depth, light, and texture.
  **Never** "minimal / empty / gradient / negative space only" — that yields a dead, blobby
  image, and no treatment can add detail that isn't there. *Atmospheric ≠ empty.*
- **On-palette by construction.** Name the variant's mood and colours in the prompt (e.g. for a
  dark cool variant: "cool blue and periwinkle, deep blacks"). Born on-brand needs no rescue.
- **Compose detail away from the text zone** — e.g. "the left side darker and emptier" for a
  background whose title sits on the left.
- **Always append "no text, no letters, no words"** — the model invents garbled type otherwise.
- **Aspect = the slot.** Backgrounds and bleeds are 16:9 (e.g. 1280×720).
- **Steps:** ~10 for hero/cover images; ~4 for incidental textures. (More steps ≈ linearly more
  time; the gain past ~12 isn't worth it.)
- **Save generated images to the deck's `public/` and reference them by path** — never regenerate
  on re-render, or every export drifts.

## 5. Focal subjects: isolate on the variant's ground
For an `image` split, prompt the subject **isolated on the variant's ground colour** — a near-black
background for dark variants, a clean white/cream background for light variants. The image then
melts seamlessly into the slide instead of sitting in an obvious rectangle. Keep a subject's
**real colour** (coffee stays brown, a product keeps its colour) — do **not** palette-lock it.

## 6. Treatment is a FALLBACK, not a default
Prefer rich on-palette images **raw** — richness survives and the theme's scrim handles legibility.
Reach for palette-lock (duotone) only when:
- the image is **off-palette** and you can't or won't regenerate, or
- you're **reusing one asset across multiple variants** (generate grayscale once, tint per variant).

Never duotone a real-colour focal subject. The treat step ships with the theme:

```sh
# off-palette background → lock it into the variant's palette (scheme-aware)
tahta-imagine raw.png public/deck-bg.jpg --variant atelier --mode duotone
```
```js
import { treat } from 'slidev-theme-tahta/imagine.mjs'   // returns a JPEG Buffer
const buf = await treat(rawPngBuffer, 'lagoon', { mode: 'duotone' })  // needs `sharp`
```
`treat` reads the variant's palette from the theme, crops to 16:9, applies a scheme-aware duotone
(dark → ink→accent, light → accent→paper), and adds subtle grain. `mode: 'none'` = crop + grain
only (the raw path).

## 7. The generation contract (you provide the model)
Any OpenAI-compatible Images endpoint works (`POST /v1/images/generations` → `{data:[{b64_json}]}`),
with `prompt`, `size`, `steps`, `seed`. tahta does not ship the call or any endpoint — wire your
own, then optionally pass the result through `tahta-imagine`.

## 8. Always look
Lint (`npx tahta-lint`), render, and **look**. A flat slide means the prompt was too thin or the
steps too low — enrich and regenerate. Imagery quality is judged by eye, not by lint.
