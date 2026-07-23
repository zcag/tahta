#!/usr/bin/env node
// Unit checks for the contract LOGIC — so a regression fails `npm test`, not just a render.
// Covers: the pedagogy/density lint warnings, the Mermaid + Vue template pre-checks,
// and lib/tex.mjs.
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

// ── Vue template pre-check ────────────────────────────────────────────────────
// A raw `"` inside a double-quoted attribute holding a JS expression fails the
// whole `slidev build`, so lint must catch it — and must NOT trip on code samples,
// autolinks, or math, which look like markup but aren't.
{
  const body = (b) => `${HEAD}layout: default\ntitle: T\n---\n\n${b}`
  const flagged = (r) => r.issues.filter(i => /Vue expression|raw `"`/.test(i.message))

  const bad = await lint(body('<Terminal :lines="[{cmd: \'a \\"b\\" c\'}]" />\n'))
  ok(bad.issues.some(i => i.level === 'error' && /broken Vue expression/.test(i.message)), 'escaped quote in a binding: lint error')
  ok((await lint(body('<Callout tone="a "b" c">x</Callout>\n'))).issues.some(i => i.level === 'warn' && /raw `"`/.test(i.message)), 'raw quote in a plain attribute: lint warning')

  const clean = {
    'a valid multi-line component': '<Terminal title="t" :lines="[\n  {cmd: \'ls -la\'},\n  {out: \'files\'}\n]" />\n',
    'a &quot;-escaped binding': '<Terminal :lines="[{cmd: &quot;awk -F\'x\' \'{print $2}\'&quot;}]" />\n',
    'quotes + tags inside a code fence': '```bash\nawk -F"[][]" "{print \\$2}" f.log\n```\n\n```html\n<div class="a" onclick="f(\'x\\")">y</div>\n```\n',
    'quotes inside inline code': 'use `<Foo bar="a \\"b\\"" />` inline\n',
    'an autolink': 'see <https://example.com/a?b="c">\n',
    'math and bare < in prose': '$$ \\frac{{a}}{b} < c $$\n\n5 < 6 and a<b\n',
  }
  for (const [what, b] of Object.entries(clean)) ok(!flagged(await lint(body(b))).length, `no false positive on ${what}`)
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
console.log('✓ contract checks: pedagogy lint, Mermaid pre-check, Vue template pre-check, tex')
