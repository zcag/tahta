// Structural validator for tahta decks. The theme owns the layout/field semantics,
// so it owns validation. Consumers (e.g. tela's deck sidecar) import this and expose
// it (an MCP `lint_deck` tool). Validates against layouts.json + variants.json.
//
//   import { lint } from 'slidev-theme-tahta/lint.mjs'
//   const { ok, issues } = await lint(markdownString)        // or an array of parsed frontmatter objects
//
// Returns { ok, errors, warnings, issues:[{ slide, level:'error'|'warn', field?, message }] }.
import { readFileSync } from 'node:fs'

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

async function toSlides (input) {
  if (Array.isArray(input)) return input.map((fm, i) => ({ fm: fm || {}, i }))
  if (typeof input === 'string') {
    let YAML
    try { const m = await import('yaml'); YAML = m.default ?? m } catch { throw new Error('lint(markdown) needs the optional "yaml" dependency — or pass an array of parsed frontmatter objects') }
    const slides = []; const re = /(^|\n)---\n([\s\S]*?)\n---(?=\n|$)/g; let m, i = 0
    while ((m = re.exec(input))) { let fm = {}; try { fm = YAML.parse(m[2]) || {} } catch {} slides.push({ fm, i: i++ }) }
    return slides
  }
  throw new Error('lint(input): pass a markdown string or an array of parsed frontmatter objects')
}

export async function lint (input, opts = {}) {
  const slides = await toSlides(input)
  const issues = []
  const add = (slide, level, message, field) => issues.push({ slide, level, message, ...(field ? { field } : {}) })

  slides.forEach(({ fm, i }) => {
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
    if (id === 'fact') bare(fm.value, 'fact.value')
    if (Array.isArray(fm.stats)) fm.stats.forEach((s, si) => bare(s?.value, `stats[${si}].value`))
    if (typeof fm.bg === 'string' && fm.bg && !BG_NAMED.has(fm.bg) && !BG_IMAGEY.test(fm.bg)) add(i, 'warn', `bg "${fm.bg}" is neither an image path nor one of ${[...BG_NAMED].join('|')}`, 'bg')
    const variant = fm.themeConfig?.variant
    if (variant && !VARIANTS.has(variant)) add(i, 'error', `themeConfig.variant "${variant}" is not a tahta variant`, 'themeConfig.variant')
  })

  const errors = issues.filter(x => x.level === 'error').length
  return { ok: opts.strict ? issues.length === 0 : errors === 0, errors, warnings: issues.length - errors, issues }
}

export default lint
