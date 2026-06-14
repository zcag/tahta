#!/usr/bin/env node
// Generate packages/theme/AGENTS.md from layouts.json + variants.json (single source of truth).
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const theme = resolve(dirname(fileURLToPath(import.meta.url)), '../packages/theme')
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

## Layouts
| layout | use for | key fields |
|---|---|---|
${m.layouts.map(l => `| \`${l.id}\` | ${l.useFor} | ${l.fields.map(f => f.name + (f.required ? '*' : '')).join(', ')} |`).join('\n')}

*\\* = required.*

## Layout details
${m.layouts.map(l => `### \`${l.id}\`\n${l.useFor}\n\n${l.fields.map(fieldLine).join('\n')}\n\n\`\`\`yaml\n---\n${l.example}\n---\n\`\`\``).join('\n\n')}

## Components
For use inside \`default\` / \`statement\` bodies.

${m.components.map(c => `- **\`<${c.name}>\`** — ${c.useFor} props: ${c.props.length ? c.props.map(p => `\`${p.name}\`${p.default ? ` (default ${p.default})` : ''}`).join(', ') : '—'}`).join('\n')}
`

writeFileSync(`${theme}/AGENTS.md`, out)
console.log(`✓ AGENTS.md generated — ${m.layouts.length} layouts, ${m.components.length} components, ${v.variants.length} variants`)
