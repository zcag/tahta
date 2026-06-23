#!/usr/bin/env node
// Drift guard. Fails `npm test` if a layout/component/variant exists in code but is
// missing from the contract (layouts.json), the generated AGENTS.md, the npm README,
// the root README, or the gallery showcase. So "add a layout" can't silently skip the
// docs / examples / site — the build won't go green until they're all in sync.
import { readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildAgents } from './gen-agents.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const theme = `${root}/packages/theme`
const read = (p) => readFileSync(`${root}/${p}`, 'utf8')
const manifest = JSON.parse(read('packages/theme/layouts.json'))
const variants = JSON.parse(read('packages/theme/variants.json'))
const errs = []

// Components that are internal plumbing, not part of the authoring contract.
const INTERNAL = new Set(['SlideFrame', 'SlideBg', 'Foot', 'BarChart', 'BrandLogo', 'SectionRail', 'Num'])

const vue = (dir) => readdirSync(`${theme}/${dir}`).filter(f => f.endsWith('.vue')).map(f => f.slice(0, -4))
const layoutFiles = vue('layouts')
const compFiles = vue('components')
const layoutIds = manifest.layouts.map(l => l.id)
const compNames = manifest.components.map(c => c.name)
const idSet = new Set(layoutIds), nameSet = new Set(compNames)

// 1. layouts/*.vue ↔ layouts.json
for (const f of layoutFiles) if (!idSet.has(f)) errs.push(`layout file "${f}.vue" has no layouts.json entry`)
for (const id of layoutIds) if (!layoutFiles.includes(id)) errs.push(`layouts.json lists "${id}" but layouts/${id}.vue is missing`)

// 2. components/*.vue ↔ layouts.json (minus internal plumbing)
for (const f of compFiles) if (!INTERNAL.has(f) && !nameSet.has(f)) errs.push(`component "${f}.vue" is undocumented — add it to layouts.json (or to INTERNAL in check-sync)`)
for (const n of compNames) if (!compFiles.includes(n)) errs.push(`layouts.json documents <${n}> but components/${n}.vue is missing`)

// 3. AGENTS.md is freshly generated
if (read('packages/theme/AGENTS.md') !== buildAgents()) errs.push('AGENTS.md is stale — run `npm run docs`')

// 4. variants.json ↔ tokens.css (editorial is the default block, no selector)
const tokens = read('packages/theme/styles/tokens.css')
const cssVariants = new Set([...tokens.matchAll(/\[data-variant='([^']+)'\]/g)].map(m => m[1]).concat('editorial'))
for (const v of variants.variants) if (!cssVariants.has(v.id)) errs.push(`variants.json "${v.id}" has no :root[data-variant] block in tokens.css`)

// 5. READMEs list every layout (npm README also every component)
const pkgReadme = read('packages/theme/README.md'), rootReadme = read('README.md')
for (const id of layoutIds) {
  if (!pkgReadme.includes(`\`${id}\``)) errs.push(`npm README (packages/theme) doesn't list layout \`${id}\``)
  if (!rootReadme.includes(`\`${id}\``)) errs.push(`root README doesn't list layout \`${id}\``)
}
for (const n of compNames) if (!pkgReadme.includes(`<${n}>`)) errs.push(`npm README (packages/theme) doesn't list component <${n}>`)

// 6. gallery deck showcases every layout (it feeds the live explorer on tahta.cagdas.io).
// `embed` needs an external video/iframe URL a static showcase can't provide — carved out on purpose.
const GALLERY_SKIP = new Set(['embed'])
const gallery = read('examples/gallery/slides.md')
for (const id of layoutIds) if (!GALLERY_SKIP.has(id) && !new RegExp(`layout:\\s*${id}(\\s|$)`, 'm').test(gallery)) errs.push(`gallery deck (examples/gallery) doesn't showcase layout "${id}"`)

// 7. gallery also showcases the author-facing body components (catalog completeness).
// Plot shows via the chart layout; Reveal/Fit/Ghost are automatic internals, not placed tags.
const COMP_GALLERY_SKIP = new Set(['Plot', 'Reveal', 'Fit', 'Ghost'])
for (const n of compNames) if (!COMP_GALLERY_SKIP.has(n) && !gallery.includes(`<${n}`)) errs.push(`gallery deck doesn't showcase component <${n}>`)

if (errs.length) {
  console.error(`✗ sync check — ${errs.length} drift issue(s):\n  - ${errs.join('\n  - ')}`)
  process.exit(1)
}
console.log(`✓ sync: ${layoutIds.length} layouts + ${compNames.length} components in sync across layouts.json · AGENTS.md · READMEs · gallery · variants`)
