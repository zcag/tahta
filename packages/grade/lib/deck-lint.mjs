import { readFileSync } from 'node:fs'
import { parse } from '@slidev/parser/core'

/**
 * Structural lint on the deck SOURCE markdown (variant-independent) — the cheap
 * safety net that catches a malformed deck a PNG render can't reliably flag.
 *
 * Today it catches one high-value mistake: an empty slide. A slide with no
 * frontmatter AND no body renders blank — almost always a stray `---` separator
 * (`---` / blank / `---`), where a trailing rule after a slide's body doubles up
 * with the next slide's frontmatter `---` and opens an empty slide between them.
 * Slidev parses it faithfully as a real `(none)`-layout blank slide, so nothing
 * downstream errors — it just ships a blank. Add more source-level checks here as
 * they surface.
 *
 * Returns [{ slide, code, msg }]; empty array = clean.
 */
export async function lintDeck (file) {
  const { slides } = await parse(readFileSync(file, 'utf8'), file)
  const issues = []
  slides.forEach((s, i) => {
    const fmKeys = Object.keys(s.frontmatter || {}).length
    const body = (s.content || '').trim()
    if (!fmKeys && !body) {
      issues.push({ slide: i + 1, code: 'empty-slide', msg: 'empty slide (no frontmatter, no body) — likely a stray `---` separator; the next slide’s frontmatter `---` already separates slides' })
    }
  })
  return issues
}
