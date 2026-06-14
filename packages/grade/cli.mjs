#!/usr/bin/env node
import { readdirSync, existsSync, cpSync, watch as fsWatch } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import sirv from 'sirv'
import { exportDeck, withVariant } from './lib/export.mjs'
import { analyze, flagsFor } from './lib/lint.mjs'
import { lintDeck } from './lib/deck-lint.mjs'
import { diffAgainst } from './lib/diff.mjs'
import { runChecks } from './lib/checks.mjs'
import { writeReport } from './lib/report.mjs'

const argv = process.argv.slice(2)
if (argv[0] === 'grade') argv.shift()
const o = { entry: null, variants: null, out: '.tahta/grade', baseline: '.tahta/baseline', updateBaseline: false, checks: false, open: false, serve: null, watch: false, timeout: 120000 }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--variants') o.variants = argv[++i].split(',').map(s => s.trim()).filter(Boolean)
  else if (a === '--out') o.out = argv[++i]
  else if (a === '--baseline') o.baseline = argv[++i]
  else if (a === '--update-baseline') o.updateBaseline = true
  else if (a === '--checks') o.checks = true
  else if (a === '--open') o.open = true
  else if (a === '--serve') o.serve = /^\d+$/.test(argv[i + 1]) ? +argv[++i] : 4180
  else if (a === '--watch') o.watch = true
  else if (a === '--timeout') o.timeout = +argv[++i]
  else if (a === '--help' || a === '-h') { help(); process.exit(0) }
  else if (!a.startsWith('-')) o.entry = a
}
o.entry = o.entry || 'slides.md'
if (!existsSync(o.entry)) { console.error(`tahta: entry not found: ${o.entry}`); process.exit(1) }

const C = { dim: s => `\x1b[2m${s}\x1b[0m`, red: s => `\x1b[31m${s}\x1b[0m`, grn: s => `\x1b[32m${s}\x1b[0m`, ylw: s => `\x1b[33m${s}\x1b[0m`, acc: s => `\x1b[38;5;75m${s}\x1b[0m` }
const numeric = (a, b) => parseInt(a) - parseInt(b)
const pngs = (dir) => readdirSync(dir).filter(f => f.endsWith('.png') && !f.startsWith('diff-')).sort(numeric)

async function grade () {
  const variants = o.variants || [null]
  const results = []
  // Structural lint on the source markdown — variant-independent, runs once.
  const structural = await lintDeck(o.entry)
  for (const s of structural) console.log(C.red(`  ⚠ source #${s.slide}: ${s.msg}`))
  for (const v of variants) {
    const name = v || 'deck'
    const dir = join(o.out, name)
    const baseDir = join(o.baseline, name)
    process.stdout.write(C.dim(`  ${name}: export `))
    let checks = null
    await withVariant(o.entry, v, async () => {
      await exportDeck(o.entry, dir, { timeout: o.timeout })
      if (o.checks) { process.stdout.write(C.dim('checks ')); checks = await runChecks(o.entry, pngs(dir).length) }
    })
    const slides = pngs(dir).map((f, idx) => {
      const file = join(dir, f)
      const a = analyze(file)
      const flags = flagsFor(a)
      let diff = null
      if (!o.updateBaseline) {
        const d = diffAgainst(file, join(baseDir, f), join(dir, 'diff-' + f))
        if (d) { diff = { pct: d.pct, rel: d.diffFile ? `${name}/diff-${f}` : null, resized: d.resized }; if (d.pct > 0.5) flags.push(`changed ${d.pct}% vs baseline`) }
      }
      const ck = checks && checks[idx]
      if (ck?.overflow) flags.push('content overflow (clipped)')
      if (ck && ck.contrast != null && ck.contrast < 2.5) flags.push(`low contrast ${ck.contrast}:1`)
      return { index: parseInt(f), rel: `${name}/${f}`, a, diff, ck, flags }
    })
    if (o.updateBaseline) cpSync(dir, baseDir, { recursive: true })
    const bad = slides.filter(s => s.flags.length).length
    console.log(bad ? C.red(`${slides.length} slides, ${bad} flagged`) : C.grn(`${slides.length} slides, clean`))
    results.push({ variant: v, dir, slides })
  }
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
  writeReport(o.out, results, { title: basename(o.entry), stamp, baseline: !o.updateBaseline && existsSync(o.baseline), checks: o.checks })
  console.log(`  report → ${C.acc(join(o.out, 'index.html'))}`)
  if (o.updateBaseline) console.log(C.ylw(`  baseline updated → ${o.baseline}`))
  for (const r of results) for (const s of r.slides) if (s.flags.length) console.log(C.red(`    ⚠ ${r.variant || 'deck'} #${s.index}: ${s.flags.join(', ')}`))
  return structural.length + results.reduce((n, r) => n + r.slides.filter(s => s.flags.length).length, 0)
}

function help () {
  console.log(`tahta — visual grading for Slidev decks

  tahta [entry] [options]

  entry                path to slides.md (default: slides.md)
  --variants a,b,c     render each themeConfig.variant (patched in place, restored after)
  --baseline <dir>     baseline dir for visual-regression diff (default: .tahta/baseline)
  --update-baseline    accept current render as the new baseline
  --checks             DOM checks via playwright: content overflow + text contrast
  --out <dir>          output dir (default: .tahta/grade)
  --serve [port]       serve the report over http (default 4180, binds 0.0.0.0)
  --open               open the report in the browser
  --watch              re-grade on file changes
  --timeout <ms>       per-export timeout (default 120000)

  Exits non-zero when any slide is flagged (blank / broken / regressed / overflow) — CI-ready.`)
}

function serve (port) {
  const handler = sirv(o.out, { dev: true })
  createServer((req, res) => handler(req, res, () => { res.statusCode = 404; res.end('not found') }))
    .listen(port, '0.0.0.0', () => console.log(`  serving → ${C.acc(`http://localhost:${port}/`)} ${C.dim('(0.0.0.0)')}`))
}
function openInBrowser (file) {
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
  spawn(cmd, [file], { stdio: 'ignore', detached: true }).unref()
}

let running = false, queued = false
async function run () {
  if (running) { queued = true; return }
  running = true
  const t0 = Date.now()
  console.log(C.acc('tahta'), C.dim(o.entry + (o.variants ? `  [${o.variants.join(', ')}]` : '')))
  let flagged = 0
  try { flagged = await grade() } catch (e) { console.error(C.red('  ' + e.message)) }
  console.log(C.dim(`  done in ${((Date.now() - t0) / 1000).toFixed(1)}s`))
  running = false
  if (queued) { queued = false; run() }
  return flagged
}

const flagged = await run()
if (o.open) openInBrowser(resolve(o.out, 'index.html'))
if (o.serve) serve(o.serve)
if (o.watch) {
  const dir = dirname(resolve(o.entry))
  console.log(C.dim(`  watching ${dir} …`))
  let timer
  fsWatch(dir, { recursive: true }, (_e, f) => {
    if (f && (f.endsWith('.png') || f.includes('.tahta'))) return
    clearTimeout(timer); timer = setTimeout(run, 250)
  })
} else if (!o.serve) {
  process.exit(flagged ? 1 : 0)
}
