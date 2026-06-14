#!/usr/bin/env node
// qa/run.mjs — fire an UNINSTRUCTED agent at the tahta authoring contract and grade
// what it does. The agent *is* the user: reading AGENTS.md yourself tells you what
// you wrote; watching an uninstructed agent author from it tells you what lands.
//
// The loop (per brief):
//   1. scaffold a clean deck project (theme installed, NO visual direction)
//   2. claude -p (stream-json) authors slides.md — full event stream saved
//   3. inspect the stream (did it find the contract? what tools, in what order?)
//      + the deck (which layouts/components, how many slides, any CSS / blank slide)
//   4. assert the regression gates (varied layouts, ≥1 component, lint-clean, no CSS)
//   5. (opt-in) --export renders PNGs via the grade CLI; --vision critiques them
//
//   node qa/run.mjs                      # all briefs, cheap stream+adherence path
//   node qa/run.mjs --brief architecture # one brief
//   node qa/run.mjs --export --vision    # also render + LLM-critique the result
//   node qa/run.mjs --keep               # keep workdirs for inspection
//   node qa/run.mjs --brief pitch --serve # build, then serve it in slidev + print a link
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir, hostname } from 'node:os'
import { spawn } from 'node:child_process'
import { parseStream, analyzeDeck, assess } from './lib/analyze.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '..')
const manifest = JSON.parse(readFileSync(`${repo}/packages/theme/layouts.json`, 'utf8'))
const layoutIds = manifest.layouts.map(l => l.id)
const componentNames = manifest.components.map(c => c.name)

// ── args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const o = { brief: null, export: false, vision: false, keep: false, serve: null, work: join(tmpdir(), 'tahta-qa'), model: null, timeout: 600000, minLayouts: 5, minComponents: 3, minComponentTypes: 2, minSlides: 6 }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--brief') o.brief = argv[++i]
  else if (a === '--export') o.export = true
  else if (a === '--vision') { o.export = true; o.vision = true }
  else if (a === '--keep') o.keep = true
  else if (a === '--serve') { o.serve = /^\d+$/.test(argv[i + 1]) ? +argv[++i] : 3030; o.keep = true }
  else if (a === '--work') o.work = argv[++i]
  else if (a === '--model') o.model = argv[++i]
  else if (a === '--timeout') o.timeout = +argv[++i]
  else if (a === '--min-layouts') o.minLayouts = +argv[++i]
  else if (a === '--min-components') o.minComponents = +argv[++i]
  else if (a === '--min-component-types') o.minComponentTypes = +argv[++i]
  else if (a === '--list') { console.log(briefs().map(b => b.name).join('\n')); process.exit(0) }
  else if (a === '--help' || a === '-h') { help(); process.exit(0) }
}

const C = { dim: s => `\x1b[2m${s}\x1b[0m`, red: s => `\x1b[31m${s}\x1b[0m`, grn: s => `\x1b[32m${s}\x1b[0m`, ylw: s => `\x1b[33m${s}\x1b[0m`, acc: s => `\x1b[38;5;75m${s}\x1b[0m`, b: s => `\x1b[1m${s}\x1b[0m` }

function briefs () {
  const dir = `${here}/briefs`
  return readdirSync(dir).filter(f => f.endsWith('.txt')).map(f => ({ name: f.slice(0, -4), text: readFileSync(`${dir}/${f}`, 'utf8').trim() }))
}

// ── one brief ──────────────────────────────────────────────────────────────────
async function runBrief (b) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const dir = join(o.work, `${b.name}-${ts}`)
  mkdirSync(dir, { recursive: true })
  // Realistic clean deck project: theme resolvable as an installed dependency, nothing else.
  symlinkSync(`${repo}/node_modules`, join(dir, 'node_modules'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'qa-deck', private: true, type: 'module', dependencies: { '@slidev/cli': '*', 'slidev-theme-tahta': '*', echarts: '*', vue: '*' } }, null, 2))

  // No visual direction; avoid the word "deck" — we test whether natural wording
  // ("presentation"/"slides") plus the theme name leads the agent to discover and
  // follow the contract on its own.
  const prompt = `You're preparing a short slide presentation. Brief: ${b.text}\n\nThis project uses the Slidev theme \`slidev-theme-tahta\` (already installed in node_modules). Write the presentation as \`slides.md\` in the current directory, following the theme's own authoring conventions. Keep it tight and well-paced.`
  writeFileSync(join(dir, 'BRIEF.md'), `${b.text}\n\n---\n${prompt}\n`)

  process.stdout.write(C.dim(`  ${b.name}: authoring `))
  const stream = await runAgent(prompt, dir)
  writeFileSync(join(dir, 'run.jsonl'), stream)
  const s = parseStream(stream)
  const deck = await analyzeDeck(join(dir, 'slides.md'), { layoutIds, componentNames })
  const verdict = assess(deck, o)

  let render = null
  if (o.export && deck.exists) { process.stdout.write(C.dim('· rendering ')); render = await exportDeck(dir) }
  let critique = null
  if (o.vision && render?.pngDir) { process.stdout.write(C.dim('· critiquing ')); critique = await visionCritique(render.pngDir, b) }
  process.stdout.write('\n')

  report(b, dir, s, deck, verdict, render, critique)
  if (!o.keep) { try { rmSync(join(dir, 'node_modules')) } catch {} } // artifacts (run.jsonl, slides.md) always kept; --keep also keeps the node_modules symlink
  return { name: b.name, pass: verdict.pass, dir, exists: deck.exists }
}

// Serve each authored deck with slidev (--remote so it's reachable over the network),
// print a link per deck, and block until Ctrl-C. Needs the kept node_modules symlink.
async function serveDecks (runs) {
  const host = hostname()
  let port = o.serve
  const servers = []
  console.log(C.acc('\nserving decks') + C.dim(' (slidev --remote; Ctrl-C to stop)'))
  for (const r of runs) {
    if (!r.exists) continue
    writeFileSync(join(r.dir, 'vite.config.ts'), "import { defineConfig } from 'vite'\nexport default defineConfig({ server: { allowedHosts: true } })\n")
    servers.push(spawn('npx', ['slidev', 'slides.md', '--port', String(port), '--remote'], { cwd: r.dir, stdio: 'ignore' }))
    console.log(`  ${r.name}: ${C.acc(`http://${host}:${port}/`)} ${C.dim('· /overview/ for all slides')}`)
    port++
  }
  if (!servers.length) { console.log(C.dim('  (no decks to serve)')); return }
  const stop = () => { for (const s of servers) s.kill('SIGTERM'); process.exit(0) }
  process.on('SIGINT', stop); process.on('SIGTERM', stop)
  await new Promise(() => {}) // block until interrupted
}

// ── claude -p (stream-json in/out) ──────────────────────────────────────────────
function runAgent (prompt, cwd) {
  return new Promise((res, rej) => {
    const args = ['-p', '--input-format', 'stream-json', '--output-format', 'stream-json', '--verbose', '--dangerously-skip-permissions']
    if (o.model) args.push('--model', o.model)
    const child = spawn('claude', args, { cwd, stdio: ['pipe', 'pipe', 'inherit'] })
    let out = ''
    const timer = setTimeout(() => { child.kill('SIGTERM'); rej(new Error('agent timed out')) }, o.timeout)
    child.stdout.on('data', d => { out += d })
    child.on('error', rej)
    child.on('close', () => { clearTimeout(timer); res(out) })
    child.stdin.write(JSON.stringify({ type: 'user', message: { role: 'user', content: prompt } }) + '\n')
    child.stdin.end()
  })
}

// ── opt-in: render PNGs via the grade CLI, reuse its blank/broken lint ───────────
function exportDeck (dir) {
  return new Promise((res) => {
    const out = join(dir, '.grade')
    const child = spawn('node', [`${repo}/packages/grade/cli.mjs`, 'slides.md', '--out', out], { cwd: dir, stdio: 'pipe' })
    let log = ''
    child.stdout.on('data', d => { log += d }); child.stderr.on('data', d => { log += d })
    child.on('error', () => res(null))
    child.on('close', code => {
      const pngDir = join(out, 'deck')
      res({ ok: code === 0, pngDir: existsSync(pngDir) ? pngDir : null, flagged: code !== 0, log })
    })
  })
}

// ── opt-in: let a vision model adversarially critique the rendered slides ────────
function visionCritique (pngDir, brief) {
  const rubric = readFileSync(`${here}/rubric.md`, 'utf8')
  const pngs = readdirSync(pngDir).filter(f => f.endsWith('.png') && !f.startsWith('diff-')).map(f => join(pngDir, f))
  const prompt = `Read these rendered slide images and critique the presentation ADVERSARIALLY — find faults, don't confirm it works.\n\nBrief the author was given: ${brief.text}\n\n${rubric}\n\nImages:\n${pngs.join('\n')}\n\nReturn ONLY JSON: {"scores":{"content":1-5,"variety":1-5,"fit":1-5,"polish":1-5},"weaknesses":["..."],"verdict":"one line"}`
  return new Promise((res) => {
    const child = spawn('claude', ['-p', '--output-format', 'json', '--dangerously-skip-permissions'], { stdio: ['pipe', 'pipe', 'inherit'] })
    let out = ''
    child.stdout.on('data', d => { out += d })
    child.on('error', () => res(null))
    child.on('close', () => {
      try { const r = JSON.parse(out); const m = (r.result || '').match(/\{[\s\S]*\}/); res(m ? JSON.parse(m[0]) : null) } catch { res(null) }
    })
    child.stdin.write(prompt); child.stdin.end()
  })
}

// ── reporting ────────────────────────────────────────────────────────────────
function report (b, dir, s, deck, verdict, render, critique) {
  const tick = ok => ok ? C.grn('✓') : C.red('✗')
  console.log(C.b(`\n▌ ${b.name}`) + C.dim(`  ${dir}`))
  const r = s.result
  console.log(C.dim(`  stream:`) + ` ${s.toolCalls.length} tool calls` + (r ? C.dim(` · ${r.turns} turns · $${(r.costUsd ?? 0).toFixed(3)} · ${(r.durationMs / 1000 | 0)}s`) : ''))
  console.log(C.dim(`  found contract:`) + ` ${s.readContract ? C.grn('yes') : C.ylw('no — discovery gap?')}`)
  console.log(C.dim(`  tools:`) + ` ${s.toolOrder.join(' → ') || '(none)'}`)
  if (deck.exists) {
    console.log(C.dim(`  variant:`) + ` ${deck.variant ? C.grn(deck.variant) : C.ylw('none — coasting on default')}`)
    console.log(C.dim(`  deck:`) + ` ${deck.slideCount} slides · ${deck.layouts.distinct} layouts {${deck.layouts.used.join(', ')}} · ${deck.components.total} components {${deck.components.used.join(', ') || '—'}}`)
  }
  for (const c of verdict.checks) console.log(`  ${tick(c.ok)} ${c.name}` + (c.detail ? C.dim(`  — ${c.detail}`) : ''))
  if (render) console.log(`  ${tick(render.ok)} render` + C.dim(render.ok ? ' — slides clean' : ' — flagged/broken (see .grade/index.html)'))
  if (critique) {
    const sc = critique.scores || {}
    console.log(C.dim(`  critique:`) + ` content ${sc.content}/5 · variety ${sc.variety}/5 · fit ${sc.fit}/5 · polish ${sc.polish}/5 — ${critique.verdict || ''}`)
    for (const w of critique.weaknesses || []) console.log(C.ylw(`    · ${w}`))
  }
  if (deck.exists && (o.keep || o.serve)) console.log(C.dim(`  view:`) + ` cd ${dir} && npx slidev slides.md --remote`)
  console.log(verdict.pass ? C.grn(`  PASS`) : C.red(`  FAIL`))
}

function help () {
  console.log(`qa/run.mjs — let an uninstructed agent test the tahta authoring contract

  node qa/run.mjs [options]

  --brief <name>        run one brief (default: all). --list to see them
  --export              also render the deck to PNG via the grade CLI
  --vision              + adversarial LLM critique of the rendered slides (implies --export)
  --keep                keep the agent workdir + node_modules symlink for inspection
  --serve [port]        after running, serve each deck with slidev (--remote) and print a link (implies --keep; default port 3030)
  --work <dir>          base workdir (default: $TMPDIR/tahta-qa)
  --model <id>          model for the authoring agent (default: claude's default)
  --min-layouts <n>     gate: distinct layouts required (default 5)
  --min-components <n>  gate: total components required (default 3)
  --min-component-types <n>  gate: distinct component types (default 2)
  --timeout <ms>        per-agent timeout (default 600000)

  Exits non-zero if any brief fails its gates — drop it in CI (manual/scheduled).`)
}

// ── main ───────────────────────────────────────────────────────────────────────
const list = o.brief ? briefs().filter(b => b.name === o.brief) : briefs()
if (!list.length) { console.error(`no brief matched "${o.brief}". --list to see them.`); process.exit(2) }
console.log(C.acc('tahta qa') + C.dim(`  ${list.length} brief(s)${o.export ? ' · export' : ''}${o.vision ? ' · vision' : ''}`))
const results = []
for (const b of list) { try { results.push(await runBrief(b)) } catch (e) { console.error(C.red(`  ${b.name}: ${e.message}`)); results.push({ name: b.name, pass: false }) } }
const failed = results.filter(r => !r.pass)
console.log(failed.length ? C.red(`\n${failed.length}/${results.length} failed: ${failed.map(r => r.name).join(', ')}`) : C.grn(`\nall ${results.length} passed`))
if (o.serve) await serveDecks(results) // blocks until Ctrl-C
process.exit(failed.length ? 1 : 0)
