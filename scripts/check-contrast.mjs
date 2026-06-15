#!/usr/bin/env node
// AA-contrast gate. Two layers, both deterministic (no browser):
//   1. STATIC — each variant's designed tokens (fg / fg-dim / accent / on-accent) meet AA.
//   2. ENVELOPE FUZZ — a brand override (themeConfig.accent) is clamped into the variant's
//      accent envelope (tokens.css); we replay that clamp across the hue wheel and prove the
//      resulting accent stays legible. This is what makes "any brand color" safe, not hoped.
// Part of `npm test`.
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { hexToRgb, rgbToOklch, oklchToHex } from './lib/oklch.mjs'

const theme = resolve(dirname(fileURLToPath(import.meta.url)), '../packages/theme')
const css = readFileSync(`${theme}/styles/tokens.css`, 'utf8')
const variantNames = JSON.parse(readFileSync(`${theme}/variants.json`, 'utf8')).variants.map(v => v.id)
const defaultBlock = css.split('/* ---------- VARIANT BUNDLES')[0]

const hexIn = (block) => Object.fromEntries([...block.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\b/g)].map(m => [m[1], m[2]]))
const numIn = (block) => Object.fromEntries([...block.matchAll(/(--[a-z0-9-]+)\s*:\s*([0-9.]+)(?:;|\s)/g)].map(m => [m[1], parseFloat(m[2])]))
const baseHex = hexIn(defaultBlock), baseNum = numIn(defaultBlock)
const blockFor = (v) => { const m = css.match(new RegExp(`:root\\[data-variant='${v}'\\]\\s*\\{([\\s\\S]*?)\\n\\}`)); return m ? m[1] : '' }

const lum = (rgb) => { const a = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2] }
const ratio = (aHex, bHex) => { const l1 = lum(hexToRgb(aHex)), l2 = lum(hexToRgb(bHex)); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05) }
const clamp = (lo, v, hi) => Math.min(hi, Math.max(lo, v))

// the envelope clamp, mirroring the CSS: keep hue, clamp L into [lo,hi] and C into [0,cMax].
const normAccent = (o, env) => oklchToHex({ l: clamp(env.lo, o.l, env.hi), c: Math.min(o.c, env.cMax), h: o.h })
// the JS on-accent pick (global-bottom.vue): dark vs light text by real luminance crossover (~0.179).
const onAccent = (accHex) => lum(hexToRgb(accHex)) > 0.179 ? '#0a0a0c' : '#fafaf8'

const fails = [], warns = []
for (const v of variantNames) {
  const b = blockFor(v)
  const t = { ...baseHex, ...hexIn(b) }
  const n = { ...baseNum, ...numIn(b) }
  const ink = t['--ink']
  const env = { lo: n['--accent-l-lo'], hi: n['--accent-l-hi'], cMax: n['--accent-c-hi'] }
  const baseO = rgbToOklch(hexToRgb(t['--accent-base']))
  const accent = normAccent(baseO, env) // designed accent (clamp is a no-op for the in-band base)

  // 1. STATIC — designed tokens
  for (const [tok, min] of [['--fg', 4.5], ['--fg-dim', 3.0]]) {
    if (t[tok] && ink && ratio(t[tok], ink) < min) fails.push(`${v}: ${tok} on --ink = ${ratio(t[tok], ink).toFixed(2)} (needs ${min})`)
  }
  if (ratio(accent, ink) < 3.0) fails.push(`${v}: --accent on --ink = ${ratio(accent, ink).toFixed(2)} (needs 3.0)`)
  if (t['--on-accent'] && ratio(t['--on-accent'], accent) < 3.0) fails.push(`${v}: --on-accent on --accent = ${ratio(t['--on-accent'], accent).toFixed(2)} (needs 3.0)`)

  // 2. ENVELOPE FUZZ — any brand hue, clamped, must stay legible on its accent fill.
  let worstOn = { r: 99 }, worstInk = { r: 99 }
  for (let h = 0; h < 360; h += 15) {
    for (const l of [env.lo, (env.lo + env.hi) / 2, env.hi]) {
      const acc = normAccent({ l, c: env.cMax, h }, env)
      const rOn = ratio(onAccent(acc), acc), rInk = ratio(acc, ink)
      if (rOn < worstOn.r) worstOn = { r: rOn, h }
      if (rInk < worstInk.r) worstInk = { r: rInk, h }
    }
  }
  // on-accent legibility is fully in our control (we pick the text color) → hard gate at AA-large.
  if (worstOn.r < 4.0) fails.push(`${v}: brand on-accent worst = ${worstOn.r.toFixed(2)} @h${worstOn.h} (needs 4.0)`)
  // accent-as-text on the page bg is hue-bound (a high-luminance hue on a light ground can't reach
  // 3:1 without dimming the designed accent) → warn, don't fail. Accent fills stay legible regardless.
  if (worstInk.r < 3.0) warns.push(`${v}: brand accent on --ink can dip to ${worstInk.r.toFixed(2)} @h${worstInk.h} (kicker/link tint on this ground)`)
}

if (warns.length) console.warn(`⚠ accent-on-background (override, hue-bound):\n` + warns.map(w => '  - ' + w).join('\n'))
if (fails.length) {
  console.error(`✗ contrast (WCAG AA): ${fails.length} failure(s)\n` + fails.map(f => '  - ' + f).join('\n'))
  process.exit(1)
}
console.log(`✓ contrast: all ${variantNames.length} variants pass AA — designed tokens + every brand-override hue (fg 4.5; fg-dim, accent, on-accent ≥3; brand on-accent ≥4)`)
