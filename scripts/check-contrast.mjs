#!/usr/bin/env node
// AA-contrast gate: every variant's text must meet WCAG AA against its own background.
// Static + deterministic — parses the hex tokens, no browser needed. Part of `npm test`.
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const theme = resolve(dirname(fileURLToPath(import.meta.url)), '../packages/theme')
const css = readFileSync(`${theme}/styles/tokens.css`, 'utf8')

// pull the default :root block (everything before the first variant) + each variant block.
// Variant ids come from variants.json (the source of truth) so a new variant is AA-gated automatically.
const variantNames = JSON.parse(readFileSync(`${theme}/variants.json`, 'utf8')).variants.map(v => v.id)
const defaultBlock = css.split("/* ---------- VARIANT BUNDLES")[0]
const tokensIn = (block) => Object.fromEntries([...block.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\b/g)].map(m => [m[1], m[2]]))
const base = tokensIn(defaultBlock)
const blockFor = (v) => {
  const re = new RegExp(`:root\\[data-variant='${v}'\\]\\s*\\{([\\s\\S]*?)\\n\\}`)
  const m = css.match(re); return m ? tokensIn(m[1]) : {}
}

const hex = (h) => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)) }
const lum = (rgb) => { const a = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2] }
const ratio = (a, b) => { const l1 = lum(hex(a)), l2 = lum(hex(b)); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05) }

// thresholds: body text AA = 4.5; secondary/large-text & UI accent = 3.0
const CHECKS = [['--fg', 4.5], ['--fg-dim', 3.0], ['--accent', 3.0]]
const fails = []
for (const v of variantNames) {
  const t = { ...base, ...blockFor(v) }
  const bg = t['--ink']
  for (const [tok, min] of CHECKS) {
    if (!t[tok] || !bg) continue
    const r = ratio(t[tok], bg)
    if (r < min) fails.push(`${v}: ${tok} on --ink = ${r.toFixed(2)}:1 (needs ${min}:1)`)
  }
}

if (fails.length) {
  console.error(`✗ contrast (WCAG AA): ${fails.length} failure(s)\n` + fails.map(f => '  - ' + f).join('\n'))
  process.exit(1)
}
console.log(`✓ contrast: all ${variantNames.length} variants pass AA (fg 4.5:1, fg-dim & accent 3:1)`)
