import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

/**
 * Pixel-diff a freshly exported slide against a baseline.
 * Returns { pct, diffFile } or null if there's no baseline to compare to.
 * Different dimensions = treated as a full change (structural).
 */
export function diffAgainst (currentFile, baselineFile, diffFile) {
  if (!existsSync(baselineFile)) return null
  const cur = PNG.sync.read(readFileSync(currentFile))
  const base = PNG.sync.read(readFileSync(baselineFile))
  if (cur.width !== base.width || cur.height !== base.height) {
    return { pct: 100, diffFile: null, resized: true }
  }
  const { width, height } = cur
  const out = new PNG({ width, height })
  const mismatch = pixelmatch(base.data, cur.data, out.data, width, height, { threshold: 0.1, diffColor: [255, 60, 120] })
  const pct = +(100 * mismatch / (width * height)).toFixed(2)
  if (mismatch > 0 && diffFile) writeFileSync(diffFile, PNG.sync.write(out))
  return { pct, diffFile: mismatch > 0 ? diffFile : null, resized: false }
}
