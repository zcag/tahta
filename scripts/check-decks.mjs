#!/usr/bin/env node
// Structural lint of every example deck's source markdown (empty slides, etc.).
// Cheap (parse-only, no render) so it runs in `npm test` as a floor — a malformed
// deck (e.g. a stray `---` that ships a blank slide) fails the build.
import { readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lintDeck } from '../packages/grade/lib/deck-lint.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const examples = readdirSync(`${root}/examples`, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => `examples/${d.name}/slides.md`)
  .filter(p => existsSync(`${root}/${p}`))

let bad = 0
for (const rel of examples) {
  const issues = await lintDeck(`${root}/${rel}`)
  for (const i of issues) { bad++; console.error(`✗ ${rel} #${i.slide}: ${i.msg}`) }
}

if (bad) { console.error(`✗ deck lint — ${bad} structural issue(s)`); process.exit(1) }
console.log(`✓ deck lint: ${examples.length} example decks, no empty/malformed slides`)
