#!/usr/bin/env node
// Token-contract test: the objective floor that prevents the "hardcoded value" /
// "token used but never defined" bug class (e.g. the chart-muted regression).
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const theme = resolve(dirname(fileURLToPath(import.meta.url)), '../packages/theme')
const read = (p) => readFileSync(join(theme, p), 'utf8')
const vueFiles = ['components', 'layouts'].flatMap(d =>
  readdirSync(join(theme, d)).filter(f => f.endsWith('.vue')).map(f => `${d}/${f}`))

const tokens = read('styles/tokens.css') + read('styles/index.css')
const defined = new Set([...tokens.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map(m => m[1]))
const ALLOW = /^--(slidev|va|un|shiki)/   // framework-owned vars

const problems = []

// 1. every var() used must be defined (or carry a fallback)
const sources = { 'styles/index.css': read('styles/index.css'), ...Object.fromEntries(vueFiles.map(f => [f, read(f)])) }
for (const [file, src] of Object.entries(sources)) {
  for (const m of src.matchAll(/var\(\s*(--[a-z0-9-]+)\s*(,)?/gi)) {
    const [, name, hasFallback] = m
    if (hasFallback || defined.has(name) || ALLOW.test(name)) continue
    problems.push(`${file}: var(${name}) is used but never defined and has no fallback`)
  }
}

// 2. components/layouts must not hardcode colors or type sizes — use tokens/classes
for (const f of vueFiles) {
  const src = read(f)
  for (const m of src.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) problems.push(`${f}: hardcoded color "${m[0]}" — use a token`)
  for (const m of src.matchAll(/\btext-(?:xs|sm|base|lg|\d?xl)\b/g)) problems.push(`${f}: raw UnoCSS type size "${m[0]}" — use an fs-* class`)
  for (const m of src.matchAll(/font-size\s*:\s*[0-9.]+(px|rem)/g)) problems.push(`${f}: inline font-size "${m[0]}" — use a token/fs-* class`)
}

if (problems.length) {
  console.error(`✗ token-contract: ${problems.length} issue(s)\n` + problems.map(p => '  - ' + p).join('\n'))
  process.exit(1)
}
console.log(`✓ token-contract: ${defined.size} tokens defined, ${vueFiles.length} components/layouts clean`)
