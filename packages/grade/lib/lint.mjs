import { PNG } from 'pngjs'
import { readFileSync } from 'node:fs'

/**
 * Cheap, dependency-light structural checks on an exported slide PNG.
 * Catches the failure modes the visual experiment kept hitting:
 *  - all-black / all-white / uniform slides (broken layout, 0-height, failed render)
 *  - near-empty slides (almost no distinct color → likely missing content)
 * The aesthetic judgement is still yours (or an LLM's) via the report; this is the smoke alarm.
 */
export function analyze (file) {
  const png = PNG.sync.read(readFileSync(file))
  const { width, height, data } = png
  const total = width * height
  const step = Math.max(1, Math.floor(total / 24000)) // ~24k samples
  let n = 0, sum = 0, sumsq = 0
  const buckets = new Set()
  let edgeInk = 0, edgeN = 0
  for (let i = 0; i < total; i += step) {
    const o = i * 4
    const r = data[o], g = data[o + 1], b = data[o + 2]
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
    sum += l; sumsq += l * l; n++
    buckets.add(((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)) // 12-bit color bucket
  }
  // coverage: fraction of sampled pixels that differ notably from the modal background
  const mean = sum / n
  const variance = Math.max(0, sumsq / n - mean * mean)
  return {
    width, height,
    luminanceStd: +Math.sqrt(variance).toFixed(1),
    distinctColors: buckets.size,
  }
}

export function flagsFor (a) {
  const f = []
  if (a.height === 0 || a.width === 0) f.push('zero dimensions')
  if (a.luminanceStd < 6) f.push('near-uniform canvas — blank or broken layout')
  else if (a.distinctColors < 14) f.push('very little content / few colors')
  return f
}
