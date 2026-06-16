# tahta — branding module

> Appended to the core authoring contract when the deck has a brand to honor (logo, brand
> color, brand name). It does NOT replace the contract — author slides exactly as AGENTS.md
> says; this only governs the deck-level brand choices in the headmatter.

Branding in tahta is **two headmatter knobs: `accent` (the brand color) and `logo`** (+ `lang`).
That's the through-line that keeps a company's decks recognizably theirs. **The `variant` is
*not* part of the brand** — it's a per-deck choice (see below). The design quality is already
in the variants and components; your job is to set the brand color + logo and let the variant
carry the rest. Don't try to rebuild the brand's exact look slide by slide.

## 1. Set the accent to the brand color — hue only, not exact
Set `themeConfig.accent` to the brand's main color. **Only the hue is honored** — its
lightness/saturation are normalized into the variant's envelope so it stays legible and
on-style. The rendered accent won't be the brand's literal hex, but it reads as the brand's
color family, and the whole palette (tints, chart series, links, on-accent text) follows it.
**One accent is enough** — there is no second brand color, and you don't need one: the same
brand hue normalizes correctly onto any variant.

## 2. Wire the logo
Set `themeConfig.logo` to the logo path/URL. It renders **prominently on openers**
(cover/section/lead/end) and as a **small mark in the footer** of content slides — automatically,
you don't place it per slide. Opt a slide out with `mark: false` (e.g. a full-bleed image
slide). Supply a logo that reads on the deck's **scheme** (light vs dark): one with transparency
works on either; a solid-background logo will look boxed. For a **monochrome** mark whose single
color is wrong for the scheme (a black mark on a dark variant), set `themeConfig.logoInvert:
true`. Don't invert a full-color logo.

## 3. The variant is a per-deck choice — keep it varied
A company makes many decks (a pitch, an onboarding, a report, an all-hands) and they *should*
look different — they have different jobs. **Brand consistency comes from the accent + logo,
which ride on any variant** — not from forcing one look. So:
- Choose the `variant` for **this deck's content, tone, and occasion** (per the core contract's
  variant guidance), the same as any non-branded deck.
- **Do not pick a variant *because of* the brand**, and **do not default every deck to the same
  one.** There is no brand→variant mapping; reaching for the "obvious" variant every time makes
  a company's decks monotonous. Consider the full range and choose deliberately for the deck in
  front of you.
- A team that genuinely wants a fixed look can just set the same variant each time — that's
  their call, not something branding should impose.

## 4. Locale
If the brand/audience language needs it, set `themeConfig.lang` (e.g. `tr`) for correct
uppercase casing on kickers.

## Example headmatter
```yaml
theme: slidev-theme-tahta
title: Acme — Series B
themeConfig:
  variant: signal           # chosen for THIS deck (a high-energy launch pitch), not for Acme
  accent: '#0A5FBD'         # Acme blue — the brand through-line; hue carries, not the exact hex
  logo: /acme-logo.svg      # hero on openers + footer mark on content slides
  lang: en
```

## When you hand back the deck
Tell the user the accent is **hue-matched, not the exact brand hex** (by design, so it stays
legible and on-style), and which `variant` you chose **for this deck** and why — noting they can
switch it; the variant is a per-deck visual direction, a shared decision, not a brand lock.
