# tahta — branding module

> Appended to the core authoring contract when the deck has a brand to honor (logo, brand
> color, brand name/personality). It does NOT replace the contract — author slides exactly as
> AGENTS.md says; this only governs the deck-level brand choices in the headmatter.

Branding in tahta is **three headmatter knobs**, not per-slide work: `variant`, `accent`,
`logo` (+ `lang`). The design quality is already in the variants and components — your job is
to choose the variant that *is* the brand and tune the accent + logo to it. Do not try to
rebuild the brand's exact look slide by slide.

## 1. Pick the variant that fits the brand — this is the biggest lever
The variant carries the brand's whole feel: typeface, shape, texture, density, motion, scheme.
Match it to the brand's personality using the Variants table's **best for** column — e.g. a
trustworthy finance brand → `boardroom`; a raw dev-tool → `brutalist`; a warm consumer product
→ `soft`; a literary/editorial brand → `press` or `muse`; a bold campaign → `poster`/`signal`.
**Let the variant do the typography.** v1 has no font override — you cannot load the brand's
exact font, and you shouldn't try; choosing the variant whose type matches the brand is the
intended path and looks better than a forced webfont.

## 2. Set the accent to the brand's primary hue — hue only, not exact
Set `themeConfig.accent` to the brand's main color. **Only the hue is honored** — its
lightness/saturation are normalized into the variant's envelope so it stays legible and
on-style. So the rendered accent won't be the brand's literal hex, but it will read as the
brand's color family, and the whole palette (tints, chart series, links, on-accent text)
follows it. Don't fight this: if the brand is loud, pick a loud variant (the variant supplies
the energy); if restrained, a restrained one. One accent is enough — there is no second brand
color in v1.

## 3. Wire the logo
Set `themeConfig.logo` to the logo path/URL. It renders **prominently on openers**
(cover/section/lead/end) and as a **small mark in the footer** of content slides — automatically,
on every slide; you don't place it per slide. Opt a slide out with `mark: false` (e.g. a
full-bleed image slide). Supply a logo that reads on the chosen variant's **scheme** (light vs
dark — see the table): a logo with transparency works on either; a solid-background logo will
look boxed. For a **monochrome** mark whose single color is wrong for the scheme (a black mark
on a dark variant), set `themeConfig.logoInvert: true`. Don't invert a full-color logo.

## 4. Locale
If the brand/audience language needs it, set `themeConfig.lang` (e.g. `tr`) for correct
uppercase casing on kickers.

## Example headmatter
```yaml
theme: slidev-theme-tahta
title: Acme — Series B
themeConfig:
  variant: boardroom        # chosen to fit Acme's trustworthy, enterprise tone
  accent: '#0A5FBD'         # Acme blue — hue carries through; not reproduced exactly
  logo: /acme-logo.svg      # hero on openers + footer mark on content slides
  lang: en
```

## When you hand back the deck
Tell the user **which variant you chose and why it fits the brand**, and that the accent is
**hue-matched, not the exact brand hex** (by design, so it stays legible and on-style) — and
that they can switch the variant if they'd prefer a different feel. The visual direction is a
shared decision.
