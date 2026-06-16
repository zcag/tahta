#!/usr/bin/env node
// tahta-imagine — make any image tahta-grade for a variant (deterministic, no network).
//
// tahta does NOT generate images (that's the operating agent's job — see modules/imagery.md).
// This is the *treat* step: crop → scheme-aware duotone (palette-lock) → grain → optional scrim.
// Per the recipe, prefer rich on-palette images RAW; reach for duotone only when an image is
// off-palette or you're reusing one asset across variants.
//
// Library:  import { treat, paletteFor } from 'slidev-theme-tahta/imagine.mjs'
// CLI:      tahta-imagine <input> <output> --variant atelier [--mode duotone|none]
//                         [--scrim left|bottom] [--no-grain] [--size 1280x720]
//
// Requires `sharp` (an optional dependency — install it where you run this).
import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const hexToRgb = (h) => { h = h.replace('#',''); if (h.length===3) h=[...h].map(c=>c+c).join(''); return { r:parseInt(h.slice(0,2),16), g:parseInt(h.slice(2,4),16), b:parseInt(h.slice(4,6),16) } }

// Read per-variant palette straight from the theme's own contract — no duplicated data.
let _pal
function palettes () {
  if (_pal) return _pal
  const css = readFileSync(resolve(HERE,'styles/tokens.css'),'utf8')
  const ids = JSON.parse(readFileSync(resolve(HERE,'variants.json'),'utf8'))
  const scheme = Object.fromEntries(ids.variants.map(v=>[v.id,v.scheme]))
  const base = css.split('/* ---------- VARIANT BUNDLES')[0]
  const grab = (block,tok)=>{ const m=block.match(new RegExp(`${tok}:\\s*(#[0-9a-fA-F]{3,6})`)); return m?m[1]:null }
  const blockOf = (id)=>{ const m=css.match(new RegExp(`:root\\[data-variant='${id}'\\]\\s*\\{([\\s\\S]*?)\\n\\}`)); return m?m[1]:'' }
  _pal = {}
  for (const v of ids.variants) {
    const b = blockOf(v.id)
    _pal[v.id] = { scheme: scheme[v.id], ink: grab(b,'--ink')||grab(base,'--ink'), accent: grab(b,'--accent-base')||grab(base,'--accent-base') }
  }
  return _pal
}
export function paletteFor (variant) {
  const p = palettes()[variant]
  if (!p) throw new Error(`unknown variant '${variant}' (have: ${Object.keys(palettes()).join(', ')})`)
  return p
}

async function loadSharp () {
  try { return (await import('sharp')).default } catch { throw new Error('tahta-imagine needs `sharp` — install it: npm i sharp') }
}

async function grainTile (sharp) {
  const n=64, buf=Buffer.alloc(n*n*4); let s=12345
  const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff }
  for (let i=0;i<n*n;i++){ const v=200+((rnd()*55)|0); buf[i*4]=v; buf[i*4+1]=v; buf[i*4+2]=v; buf[i*4+3]=(rnd()*38)|0 }
  return sharp(buf,{ raw:{width:n,height:n,channels:4} }).png().toBuffer()
}

// scheme-aware duotone: dark → shadows=ink, highlights=accent · light → shadows=accent, highlights=ink(paper)
async function duotone (sharp, input, variant, contrast=1.15) {
  const p = paletteFor(variant)
  const [lo,hi] = p.scheme==='dark' ? [hexToRgb(p.ink),hexToRgb(p.accent)] : [hexToRgb(p.accent),hexToRgb(p.ink)]
  const { width:W, height:H } = await sharp(input).metadata()
  const gray = await sharp(input).grayscale().linear(contrast,-(128*(contrast-1))).removeAlpha().raw().toBuffer()
  const px = Buffer.alloc(W*H*3)
  for (let i=0;i<W*H;i++){ const L=gray[i*3]/255
    px[i*3]=lo.r+(hi.r-lo.r)*L; px[i*3+1]=lo.g+(hi.g-lo.g)*L; px[i*3+2]=lo.b+(hi.b-lo.b)*L }
  return sharp(px,{ raw:{width:W,height:H,channels:3} })
}

/** Treat an image for a variant. input: path|Buffer. Returns a JPEG Buffer.
 *  opts: { mode:'duotone'|'none', grain:true, scrim:null|'left'|'bottom', w:1280, h:720 } */
export async function treat (input, variant, { mode='duotone', grain=true, scrim=null, w=1280, h=720 } = {}) {
  const sharp = await loadSharp()
  const cropped = await sharp(input).resize(w,h,{ fit:'cover' }).toBuffer()
  let pipe = mode==='duotone' ? await duotone(sharp,cropped,variant) : sharp(cropped)
  const layers = []
  if (grain) layers.push({ input: await grainTile(sharp), tile:true, blend:'overlay' })
  if (scrim) {
    const ink = hexToRgb(paletteFor(variant).ink)
    const dir = scrim==='bottom' ? 'x1="0" y1="1" x2="0" y2="0"' : 'x1="0" y1="0" x2="1" y2="0"'
    const svg = `<svg width="${w}" height="${h}"><defs><linearGradient id="g" ${dir}>`+
      `<stop offset="0" stop-color="rgb(${ink.r},${ink.g},${ink.b})" stop-opacity="0.9"/>`+
      `<stop offset="0.55" stop-color="rgb(${ink.r},${ink.g},${ink.b})" stop-opacity="0.3"/>`+
      `<stop offset="1" stop-opacity="0"/></linearGradient></defs>`+
      `<rect width="${w}" height="${h}" fill="url(#g)"/></svg>`
    layers.push({ input: Buffer.from(svg), top:0, left:0 })
  }
  if (layers.length) pipe = sharp(await pipe.png().toBuffer()).composite(layers)
  return pipe.jpeg({ quality:88 }).toBuffer()
}

// ---- CLI ----
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const a = process.argv.slice(2)
  const valueFlags = new Set(['--variant','--mode','--scrim','--size'])
  const flag = (n,d)=>{ const i=a.indexOf(n); return i<0?d:a[i+1] }
  const pos = []
  for (let i=0;i<a.length;i++){ const x=a[i]; if (x.startsWith('--')){ if (valueFlags.has(x)) i++; continue } pos.push(x) }
  const [input,output] = pos
  const variant = flag('--variant')
  if (!input || !output || !variant) {
    console.error('usage: tahta-imagine <input> <output> --variant <id> [--mode duotone|none] [--scrim left|bottom] [--no-grain] [--size 1280x720]')
    process.exit(1)
  }
  const [w,h] = (flag('--size','1280x720')).split('x').map(Number)
  const buf = await treat(input, variant, {
    mode: flag('--mode','duotone'), grain: !a.includes('--no-grain'),
    scrim: a.includes('--scrim') ? flag('--scrim','left') : null, w, h,
  })
  const { writeFileSync } = await import('node:fs')
  writeFileSync(output, buf)
  console.log(`✓ treated ${input} → ${output} (${variant})`)
}
