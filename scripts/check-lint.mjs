#!/usr/bin/env node
// Unit checks for the contract LOGIC — so a regression fails `npm test`, not just a render.
// Covers: the pedagogy/density lint warnings, the Mermaid syntax pre-check, and lib/tex.mjs.
import { lint } from '../packages/theme/lint.mjs'

let fails = 0
const ok = (cond, msg) => { if (cond) return; console.error(`  ✗ ${msg}`); fails++ }

const HEAD = '---\ntheme: slidev-theme-tahta\nthemeConfig: { variant: editorial }\n'

// ── pedagogy / density warnings ───────────────────────────────────────────────
{
  const longBullet = 'this single bullet runs on and on well past any sane slide length, ' +
    'a whole sentence of prose that should be a short phrase instead of a paragraph dumped onto a slide like this'
  const md = `${HEAD}layout: define\nterm: Overloaded\npoints: [one, two, three, four, five, six, seven, eight, "${longBullet}"]\n---\n\n` +
    '---\nlayout: diagram\ntitle: empty\n---\n\nnothing here\n\n' +
    '---\nlayout: define\nterm: A\n---\n\n---\nlayout: define\nterm: B\n---\n\n---\nlayout: define\nterm: C\n---\n'
  const r = await lint(md)
  const warns = r.issues.filter(i => i.level === 'warn').map(i => i.message)
  ok(r.errors === 0, 'dense deck: no errors (warnings only)')
  ok(warns.some(m => /bullets on one slide/.test(m)), 'warns on too many bullets')
  ok(warns.some(m => /a bullet runs \d+ chars/.test(m)), 'warns on an over-long bullet')
  ok(warns.some(m => /in a row/.test(m)), 'warns on the same layout 3× in a row')
  ok(warns.some(m => /no ```mermaid/.test(m)), 'warns on an empty diagram')
}

// ── Mermaid syntax pre-check ──────────────────────────────────────────────────
{
  const good = await lint(`${HEAD}layout: diagram\n---\n\n` + '```mermaid\nflowchart TD\n  A --> B\n```\n')
  ok(good.errors === 0, 'valid mermaid: no error')
  const bad = await lint(`${HEAD}layout: diagram\n---\n\n` + '```mermaid\nflowchart TD\n  A --> {oops(\n```\n')
  ok(bad.issues.some(i => i.level === 'error' && /Mermaid syntax/.test(i.message)), 'broken mermaid: lint error')
}

// ── lib/tex.mjs (skip gracefully if katex isn't installed) ────────────────────
{
  let tex
  try { ({ tex } = await import('../packages/theme/lib/tex.mjs')) } catch { tex = null }
  if (!tex) {
    console.log('  · tex checks skipped (katex not installed)')
  } else {
    ok(/katex/.test(tex('cost is $O(n)$')), 'tex renders inline math')
    ok(/katex/.test(tex('$$\\sum_i x_i$$')), 'tex renders block math')
    ok(tex('no math here') === 'no math here', 'tex passes plain text through unchanged')
    ok(tex('<span class="accent2">x</span>') === '<span class="accent2">x</span>', 'tex leaves HTML without $ untouched')
  }
}

if (fails) { console.error(`✗ contract checks — ${fails} failure(s)`); process.exit(1) }
console.log('✓ contract checks: pedagogy lint, Mermaid pre-check, tex')
