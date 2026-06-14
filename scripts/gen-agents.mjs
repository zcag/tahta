#!/usr/bin/env node
// Generate packages/theme/AGENTS.md from layouts.json + variants.json (single source of truth).
// `buildAgents()` returns the rendered markdown so check-sync.mjs can verify AGENTS.md is fresh.
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const theme = resolve(dirname(fileURLToPath(import.meta.url)), '../packages/theme')

export function buildAgents () {
const m = JSON.parse(readFileSync(`${theme}/layouts.json`, 'utf8'))
const v = JSON.parse(readFileSync(`${theme}/variants.json`, 'utf8'))

const fieldLine = (f) => {
  const req = f.required ? '**required**' : 'optional'
  const enm = f.enum ? ` — one of \`${f.enum.join(' | ')}\`` : ''
  const items = f.items ? ` — items: \`${Object.entries(f.items).map(([k, t]) => `${k}: ${t}`).join(', ')}\`` : ''
  const props = f.props ? ` — \`${Object.entries(f.props).map(([k, t]) => `${k}: ${t}`).join('; ')}\`` : ''
  return `  - \`${f.name}\` (${f.type}, ${req})${f.description ? ' — ' + f.description : ''}${enm}${items}${props}`
}

let out = `<!-- GENERATED from layouts.json + variants.json by scripts/gen-agents.mjs — do not edit by hand. -->
# tahta — authoring contract for agents

Generate a Slidev deck with \`slidev-theme-tahta\`. **No CSS, \`<style>\`, grids, or layout HTML** — pick a \`layout\` per slide and fill its frontmatter. The theme renders kicker, title, footer (auto page numbers), background, type, color, spacing, and motion.

## Rules
${m.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Deck header (first slide)
\`\`\`yaml
theme: slidev-theme-tahta
title: My Talk
themeConfig:
${m.themeConfig.fields.map(f => `  # ${f.name}: ${f.enum ? f.enum.join(' | ') : f.type}${f.description ? '  — ' + f.description : ''}`).join('\n')}
\`\`\`

## Variants (themeConfig.variant)
| id | scheme | description |
|---|---|---|
${v.variants.map(x => `| \`${x.id}\` | ${x.scheme} | ${x.description} |`).join('\n')}

Override the brand color with \`themeConfig.accent\`; set \`themeConfig.lang\` (e.g. \`tr\`) for correct locale casing.

## Universal per-slide fields
${m.universal.description}
${m.universal.fields.map(fieldLine).join('\n')}

## Layouts
| layout | use for | key fields |
|---|---|---|
${m.layouts.map(l => `| \`${l.id}\` | ${l.useFor} | ${l.fields.map(f => f.name + (f.required ? '*' : '')).join(', ')} |`).join('\n')}

*\\* = required.*

## Layout details
${m.layouts.map(l => `### \`${l.id}\`\n${l.useFor}\n\n${l.fields.map(fieldLine).join('\n')}\n\n\`\`\`yaml\n---\n${l.example}\n---\n\`\`\``).join('\n\n')}

## Components
Compose these inside \`default\` / \`statement\` / \`two-cols\` bodies to enrich any slide — not only when a layout lacks a field. A composed slide is how a deck earns its bespoke, high-richness moments; reach for them rather than filling another template.

${m.components.map(c => `- **\`<${c.name}>\`** — ${c.useFor} props: ${c.props.length ? c.props.map(p => `\`${p.name}\`${p.default ? ` (default ${p.default})` : ''}`).join(', ') : '—'}${c.example ? `\n  \`${c.example}\`` : ''}`).join('\n')}
`
  return out
}

// Run directly → write the file.
if (process.argv[1] && process.argv[1].endsWith('gen-agents.mjs')) {
  const m = JSON.parse(readFileSync(`${theme}/layouts.json`, 'utf8'))
  const v = JSON.parse(readFileSync(`${theme}/variants.json`, 'utf8'))
  writeFileSync(`${theme}/AGENTS.md`, buildAgents())
  console.log(`✓ AGENTS.md generated — ${m.layouts.length} layouts, ${m.components.length} components, ${v.variants.length} variants`)
}
