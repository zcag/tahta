#!/usr/bin/env node
// Regenerate the README images from source. Run: npm run assets
import { rmSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { exportDeck, withVariant } from '../packages/grade/lib/export.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const cache = join(root, 'docs/assets/.cache')
const out = join(root, 'docs/assets')
const VARIANTS = ['editorial', 'brutalist', 'soft', 'minimal']
const BG = '#0a0a0a'

const label = (text, w) => Buffer.from(
  `<svg width="${w}" height="34"><text x="2" y="23" font-family="ui-monospace,monospace" font-size="15" letter-spacing="2" fill="#9aa3b7">${text.toUpperCase()}</text></svg>`)

async function grid (items, { cols, tileW = 760, gap = 16, labelH = 34, file }) {
  const tiles = []
  for (const it of items) {
    const { data, info } = await sharp(it.path).resize({ width: tileW }).png().toBuffer({ resolveWithObject: true })
    tiles.push({ data, w: info.width, h: info.height, label: it.label })
  }
  const rowH = Math.max(...tiles.map(t => t.h))
  const rows = Math.ceil(tiles.length / cols)
  const cellH = labelH + rowH
  const W = gap + cols * (tileW + gap)
  const H = gap + rows * (cellH + gap)
  const comp = []
  tiles.forEach((t, i) => {
    const c = i % cols, r = Math.floor(i / cols)
    const x = gap + c * (tileW + gap)
    const y = gap + r * (cellH + gap)
    if (t.label) comp.push({ input: label(t.label, tileW), left: x, top: y })
    comp.push({ input: t.data, left: x, top: y + labelH })
  })
  await sharp({ create: { width: W, height: H, channels: 4, background: BG } }).composite(comp).png().toFile(file)
  console.log('  ✓', file.replace(root + '/', ''))
}

async function main () {
  rmSync(cache, { recursive: true, force: true }); mkdirSync(cache, { recursive: true })
  const edge = join(root, 'examples/edge/slides.md')
  const gallery = join(root, 'examples/gallery/slides.md')

  // edge stats slide (#2) across all variants → variants.png (hero)
  for (const v of VARIANTS) {
    process.stdout.write(`  export edge:${v} … `)
    await withVariant(edge, v, () => exportDeck(edge, join(cache, 'edge', v)))
    console.log('done')
  }
  await grid(VARIANTS.map(v => ({ path: join(cache, 'edge', v, '2.png'), label: v })),
    { cols: 2, file: join(out, 'variants.png') })

  // gallery (editorial) layout catalog → layouts.png
  process.stdout.write('  export gallery:editorial … ')
  await withVariant(gallery, 'editorial', () => exportDeck(gallery, join(cache, 'gallery')))
  console.log('done')
  const pick = [['1', 'cover'], ['4', 'stats'], ['9', 'feature'], ['6', 'chart'], ['7', 'steps'], ['8', 'fact'], ['10', 'two-cols'], ['14', 'bleed']]
  await grid(pick.map(([n, l]) => ({ path: join(cache, 'gallery', `${n}.png`), label: l })),
    { cols: 2, file: join(out, 'layouts.png') })

  rmSync(cache, { recursive: true, force: true })
  console.log('\nassets written to docs/assets/')
}
main().catch(e => { console.error(e); process.exit(1) })
