import { readFileSync, existsSync } from 'node:fs'
import { parse } from '@slidev/parser/core'
import { lint } from '../../packages/theme/lint.mjs'

// ── stream inspection ────────────────────────────────────────────────────────
// Pull the decision stream out of a `claude -p` stream-json run.jsonl: which tools
// it called and in what order, whether it discovered the theme's authoring
// contract, and the final cost/turns. The *decisions* are the signal — watching
// them is how you learn what the guide actually lands, vs what you think you wrote.
export function parseStream (jsonl) {
  const events = jsonl.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
  const toolCalls = []
  let result = null
  for (const e of events) {
    if (e.type === 'assistant') {
      for (const c of e.message?.content || []) if (c.type === 'tool_use') toolCalls.push({ name: c.name, input: c.input || {} })
    } else if (e.type === 'result') {
      result = { turns: e.num_turns, costUsd: e.total_cost_usd, durationMs: e.duration_ms, text: e.result }
    }
  }
  // Did it find the theme contract (AGENTS.md / README) before authoring?
  const readContract = toolCalls.some(t => /slidev-theme-tahta.*(AGENTS|README)|tahta.*AGENTS\.md|AGENTS\.md/i.test(JSON.stringify(t.input)))
  return { toolCalls, toolOrder: toolCalls.map(t => t.name), result, readContract }
}

// ── deck inspection ──────────────────────────────────────────────────────────
// What did the agent actually author? Which layouts/components, how many slides,
// any raw CSS (a contract violation), any empty/malformed slides.
export async function analyzeDeck (slidesPath, { layoutIds, componentNames }) {
  if (!existsSync(slidesPath)) return { exists: false }
  const raw = readFileSync(slidesPath, 'utf8')
  const { slides } = await parse(raw, slidesPath)

  const layoutCounts = {}
  for (const s of slides) {
    if (!Object.keys(s.frontmatter || {}).length && !(s.content || '').trim()) continue // skip blanks
    const l = s.frontmatter?.layout || 'default'
    layoutCounts[l] = (layoutCounts[l] || 0) + 1
  }

  const compSet = new Set(componentNames)
  const compCounts = {}
  for (const m of raw.matchAll(/<([A-Z][A-Za-z]+)\b/g)) if (compSet.has(m[1])) compCounts[m[1]] = (compCounts[m[1]] || 0) + 1

  return {
    exists: true,
    slideCount: slides.length,
    variant: slides[0]?.frontmatter?.themeConfig?.variant || null,
    layouts: { counts: layoutCounts, used: Object.keys(layoutCounts), distinct: Object.keys(layoutCounts).length },
    components: { counts: compCounts, used: Object.keys(compCounts), distinct: Object.keys(compCounts).length, total: Object.values(compCounts).reduce((a, b) => a + b, 0) },
    hasRawCss: /<style\b/i.test(raw),
    lintIssues: (await lint(raw)).issues.filter(x => x.level === 'error'),
  }
}

// ── verdict ──────────────────────────────────────────────────────────────────
// Turn the measurements into pass/fail gates. These are the regression assertions
// the notes call for: across briefs the agent should reach for varied layouts AND
// at least one component, never emit CSS, and never ship a malformed slide.
export function assess (deck, t = {}) {
  const { minLayouts = 5, minComponents = 3, minComponentTypes = 2, minSlides = 6 } = t
  const checks = []
  const add = (name, ok, detail) => checks.push({ name, ok, detail })

  add('authored slides.md', deck.exists, deck.exists ? '' : 'no slides.md produced')
  if (deck.exists) {
    add('parses & lint-clean', deck.lintIssues.length === 0, deck.lintIssues.map(i => `#${i.slide} ${i.message}`).join('; '))
    add(`≥${minSlides} slides`, deck.slideCount >= minSlides, `${deck.slideCount} slides`)
    add(`≥${minLayouts} distinct layouts`, deck.layouts.distinct >= minLayouts, `${deck.layouts.distinct}: ${deck.layouts.used.join(', ')}`)
    add(`≥${minComponents} component(s)`, deck.components.total >= minComponents, deck.components.total ? `${deck.components.total}× ${deck.components.used.join(', ')}` : 'none used')
    add(`≥${minComponentTypes} component types`, deck.components.distinct >= minComponentTypes, `${deck.components.distinct} distinct: ${deck.components.used.join(', ') || '—'}`)
    add('no raw CSS', !deck.hasRawCss, deck.hasRawCss ? '<style> found — contract violation' : '')
  }
  return { pass: checks.every(c => c.ok), checks }
}
