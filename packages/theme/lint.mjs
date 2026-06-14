#!/usr/bin/env node
// Structural validator for tahta decks. The theme owns the layout/field semantics,
// so it owns validation. Consumers (e.g. tela's deck sidecar) import this and expose
// it (an MCP `lint_deck` tool); the grade CLI and the qa harness reuse it too.
// Validates against layouts.json + variants.json.
//
//   import { lint } from 'slidev-theme-tahta/lint.mjs'
//   const { ok, issues } = await lint(markdownString)        // or an array of parsed frontmatter objects
//
//   npx tahta-lint slides.md                                  # CLI — exits non-zero on errors
//
// Returns { ok, errors, warnings, issues:[{ slide, level:'error'|'warn', field?, message }] }.
import { readFileSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const manifest = JSON.parse(readFileSync(new URL('./layouts.json', import.meta.url)))
const variantsDoc = JSON.parse(readFileSync(new URL('./variants.json', import.meta.url)))

const LAYOUTS = Object.fromEntries(manifest.layouts.map(l => [l.id, l]))
const VARIANTS = new Set(variantsDoc.variants.map(v => v.id))
const SLIDEV_LAYOUTS = new Set(['default', 'center', 'cover', 'intro', 'section', 'statement', 'fact', 'quote', 'two-cols', 'image', 'image-left', 'image-right', 'iframe', 'iframe-left', 'iframe-right', 'full', 'none', 'end'])
const GLOBAL_KEYS = new Set(['layout', 'class', 'foot', 'transition', 'clicks', 'clicksStart', 'level', 'src', 'hide', 'hideInToc', 'name', 'zoom', 'dragPos', 'disabled', 'routeAlias', 'preload', 'ghost', 'glow', 'bg', 'mdc'])
const BG_NAMED = new Set(['mesh', 'aurora', 'grain', 'dots', 'grid'])
const BG_IMAGEY = /^(https?:|\/|\.\/|\.\.\/|data:)|\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i
const HEADMATTER_KEYS = new Set(['theme', 'title', 'titleTemplate', 'info', 'author', 'keywords', 'themeConfig', 'fonts', 'colorSchema', 'highlighter', 'lineNumbers', 'drawings', 'aspectRatio', 'canvasWidth', 'selectable', 'remoteAssets', 'download', 'exportFilename', 'export', 'seoMeta', 'favicon', 'routerMode'])

const typeOf = (t = '') => /array/.test(t) ? 'array' : /object/.test(t) ? 'object' : (/number/.test(t) && !/string/.test(t)) ? 'number' : /boolean/.test(t) ? 'boolean' : 'any'
const enumOf = (f) => Array.isArray(f.enum) ? f.enum : (/enum\s+([a-z|]+)/.exec(f.type || '')?.[1]?.split('|') ?? null)
const NOT_BARE = /[^\d.,\-−\s]/  // any char that isn't part of a plain number (− = U+2212)

// Every key that may legitimately appear in frontmatter — for the leaked-frontmatter check.
const ALL_KEYS = new Set([...GLOBAL_KEYS, ...HEADMATTER_KEYS, 'themeConfig', 'accent', 'lang', 'variant', ...manifest.layouts.flatMap(l => l.fields.map(f => f.name))])
const KEYLINE = /^\s*([A-Za-z][\w-]*):(\s|$)/
// A slide body that *starts* with frontmatter-looking key lines almost always means the
// previous slide's frontmatter wasn't closed with `---`, so Slidev renders it as prose.
function leakedFrontmatter (body) {
  if (!body) return null
  const lead = []
  for (const ln of body.split('\n')) {
    if (!ln.trim()) { if (lead.length) break; else continue }   // skip leading blanks; stop at first gap after keys
    const m = KEYLINE.exec(ln)
    if (!m || !ALL_KEYS.has(m[1])) break
    lead.push(m[1])
  }
  return (lead[0] === 'layout' || lead.length >= 2) ? lead : null
}

async function toSlides (input) {
  if (Array.isArray(input)) return input.map((fm, i) => ({ fm: fm || {}, body: null, i }))
  if (typeof input !== 'string') throw new Error('lint(input): pass a markdown string or an array of parsed frontmatter objects')
  // Prefer Slidev's own parser: we then see the exact slide boundaries & bodies the
  // renderer does, which is what makes the leaked/unclosed-frontmatter check reliable.
  try {
    const { parseSync } = await import('@slidev/parser')
    const { slides } = parseSync(input, '')
    return slides.map((s, i) => ({ fm: s.frontmatter || {}, body: s.content || '', i }))
  } catch {}
  // Fallback (no Slidev around): light regex + optional yaml — field checks only, no body checks.
  let YAML
  try { const m = await import('yaml'); YAML = m.default ?? m } catch { throw new Error('lint(markdown) needs "@slidev/parser" or the optional "yaml" dependency — or pass an array of parsed frontmatter objects') }
  const slides = []; const re = /(^|\n)---\n([\s\S]*?)\n---(?=\n|$)/g; let m, i = 0
  while ((m = re.exec(input))) { let fm = {}; try { fm = YAML.parse(m[2]) || {} } catch {} slides.push({ fm, body: null, i: i++ }) }
  return slides
}

export async function lint (input, opts = {}) {
  const slides = await toSlides(input)
  const issues = []
  const add = (slide, level, message, field) => issues.push({ slide, level, message, ...(field ? { field } : {}) })

  slides.forEach(({ fm, body, i }) => {
    // Empty slide: no frontmatter AND no body → renders blank. Almost always a stray
    // `---` (the next slide's frontmatter `---` already separates slides, so a trailing
    // `---` after a body opens an empty slide between them). Only checkable when we have
    // the body text (markdown input), not in frontmatter-array mode.
    if (body != null && !Object.keys(fm || {}).length && !body.trim()) {
      return add(i, 'error', 'empty slide (no frontmatter, no body) — likely a stray `---` separator; the next slide’s frontmatter `---` already separates slides')
    }
    const leak = leakedFrontmatter(body)
    if (leak) add(i, 'error', `slide body starts with frontmatter keys (${leak.slice(0, 3).join(', ')}…) — a slide's frontmatter probably isn't closed with \`---\`, so it renders as text`)
    if (!fm || typeof fm !== 'object') return
    const id = fm.layout || 'default'
    const L = LAYOUTS[id]
    if (!L) { if (!SLIDEV_LAYOUTS.has(id)) add(i, 'error', `unknown layout "${id}"`, 'layout'); return }
    const fields = Object.fromEntries(L.fields.map(f => [f.name, f]))

    for (const f of L.fields) {
      if (!f.required) continue
      const v = fm[f.name]
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) add(i, 'error', `${id}: missing required field "${f.name}"`, f.name)
    }
    for (const [k, v] of Object.entries(fm)) {
      if (GLOBAL_KEYS.has(k) || (i === 0 && HEADMATTER_KEYS.has(k))) continue
      const f = fields[k]
      if (!f) { add(i, 'warn', `${id}: unknown field "${k}"`, k); continue }
      if (v == null) continue
      const t = typeOf(f.type)
      if (t === 'array' && !Array.isArray(v)) add(i, 'error', `${id}: "${k}" must be an array`, k)
      if (t === 'object' && (typeof v !== 'object' || Array.isArray(v))) add(i, 'error', `${id}: "${k}" must be an object`, k)
      if (t === 'number' && typeof v === 'string' && v.trim() !== '' && isNaN(Number(v))) add(i, 'warn', `${id}: "${k}" should be a number`, k)
      const en = enumOf(f)
      if (en && typeof v === 'string' && !en.includes(v)) add(i, 'error', `${id}: "${k}"="${v}" not one of ${en.join('|')}`, k)
    }
    if (id === 'chart' && fm.chart?.type && !['bar', 'line', 'area', 'donut'].includes(fm.chart.type)) add(i, 'error', `chart.type "${fm.chart.type}" not one of bar|line|area|donut`, 'chart.type')
    const bare = (val, where) => { if (typeof val === 'string' && NOT_BARE.test(val)) add(i, 'warn', `${where}: keep the number bare, put the symbol in \`unit\` (got "${val}")`) }
    if (id === 'fact' || id === 'metric') bare(fm.value, `${id}.value`)
    if (Array.isArray(fm.stats)) fm.stats.forEach((s, si) => bare(s?.value, `stats[${si}].value`))
    if (typeof fm.bg === 'string' && fm.bg && !BG_NAMED.has(fm.bg) && !BG_IMAGEY.test(fm.bg)) add(i, 'warn', `bg "${fm.bg}" is neither an image path nor one of ${[...BG_NAMED].join('|')}`, 'bg')
    const variant = fm.themeConfig?.variant
    if (variant && !VARIANTS.has(variant)) add(i, 'error', `themeConfig.variant "${variant}" is not a tahta variant`, 'themeConfig.variant')
  })

  // themeConfig.variant is required on a full deck — a deliberate visual choice, never a
  // silent default. Only enforced for full markdown decks that declare this theme (skipped
  // for frontmatter-array input, where there's no headmatter to check).
  if (typeof input === 'string') {
    const head = slides[0]?.fm || {}
    if (/tahta/.test(head.theme || '') && !head.themeConfig?.variant) {
      add(0, 'error', 'themeConfig.variant is required — choose a variant deliberately to fit the talk (see the Variants table); don’t omit it to coast on a default', 'themeConfig.variant')
    }
  }

  const errors = issues.filter(x => x.level === 'error').length
  return { ok: opts.strict ? issues.length === 0 : errors === 0, errors, warnings: issues.length - errors, issues }
}

export default lint

// CLI: `tahta-lint <slides.md> [...]` — the one-command pre-flight for authoring
// agents and CI. Exits non-zero on any error-level issue.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = process.argv.slice(2)
  if (!files.length) { console.error('usage: tahta-lint <slides.md> [...]'); process.exit(2) }
  let errors = 0, warnings = 0
  for (const f of files) {
    const { issues } = await lint(readFileSync(f, 'utf8'))
    for (const x of issues) {
      const tag = x.level === 'error' ? '✗' : '·'
      console.error(`${tag} ${f} #${x.slide} [${x.level}]: ${x.message}`)
      x.level === 'error' ? errors++ : warnings++
    }
  }
  if (errors) { console.error(`\n${errors} error(s), ${warnings} warning(s)`); process.exit(1) }
  console.log(warnings ? `✓ no errors (${warnings} warning(s))` : '✓ deck lint: clean')
}
