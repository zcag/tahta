#!/usr/bin/env node
// Structural lint of every example deck's source markdown (empty slides, unclosed
// frontmatter, missing required fields, …). Cheap (parse-only, no render) so it runs
// in `npm test` as a floor — a malformed deck fails the build. Reuses the theme's own
// exported validator (the contract owner), not a parallel implementation.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lint } from '../packages/theme/lint.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const examples = readdirSync(`${root}/examples`, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => `examples/${d.name}/slides.md`)
  .filter(p => existsSync(`${root}/${p}`))

let bad = 0
for (const rel of examples) {
  const { issues } = await lint(readFileSync(`${root}/${rel}`, 'utf8'))
  for (const i of issues.filter(x => x.level === 'error')) { bad++; console.error(`✗ ${rel} #${i.slide}: ${i.message}`) }
}

if (bad) { console.error(`✗ deck lint — ${bad} structural issue(s)`); process.exit(1) }
console.log(`✓ deck lint: ${examples.length} example decks, no empty/malformed slides`)
