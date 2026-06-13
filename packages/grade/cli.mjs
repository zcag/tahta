#!/usr/bin/env node
import { readdirSync, existsSync, watch as fsWatch } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import sirv from 'sirv'
import { exportDeck, withVariant } from './lib/export.mjs'
import { analyze, flagsFor } from './lib/lint.mjs'
import { writeReport } from './lib/report.mjs'

const argv = process.argv.slice(2)
if (argv[0] === 'grade') argv.shift()
const opts = { entry: null, variants: null, out: '.tahta/grade', open: false, serve: null, watch: false, timeout: 120000 }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--variants') opts.variants = argv[++i].split(',').map(s => s.trim()).filter(Boolean)
  else if (a === '--out') opts.out = argv[++i]
  else if (a === '--open') opts.open = true
  else if (a === '--serve') opts.serve = /^\d+$/.test(argv[i + 1]) ? +argv[++i] : 4180
  else if (a === '--watch') opts.watch = true
  else if (a === '--timeout') opts.timeout = +argv[++i]
  else if (a === '--help' || a === '-h') { help(); process.exit(0) }
  else if (!a.startsWith('-')) opts.entry = a
}
opts.entry = opts.entry || 'slides.md'
if (!existsSync(opts.entry)) { console.error(`tahta: entry not found: ${opts.entry}`); process.exit(1) }

const C = { dim: s => `\x1b[2m${s}\x1b[0m`, red: s => `\x1b[31m${s}\x1b[0m`, grn: s => `\x1b[32m${s}\x1b[0m`, acc: s => `\x1b[38;5;75m${s}\x1b[0m` }
const numeric = (a, b) => parseInt(a) - parseInt(b)

async function grade () {
  const variants = opts.variants || [null]
  const results = []
  for (const v of variants) {
    const dir = join(opts.out, v || 'deck')
    process.stdout.write(C.dim(`  exporting ${v || 'deck'} … `))
    await withVariant(opts.entry, v, () => exportDeck(opts.entry, dir, { timeout: opts.timeout }))
    const files = readdirSync(dir).filter(f => f.endsWith('.png')).sort(numeric)
    const slides = files.map(f => {
      const a = analyze(join(dir, f))
      return { index: parseInt(f), rel: `${v || 'deck'}/${f}`, a, flags: flagsFor(a) }
    })
    const bad = slides.filter(s => s.flags.length).length
    console.log(bad ? C.red(`${slides.length} slides, ${bad} flagged`) : C.grn(`${slides.length} slides, clean`))
    results.push({ variant: v, dir, slides })
  }
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
  const flagged = writeReport(opts.out, results, { title: basename(opts.entry), stamp })
  console.log(`  report → ${C.acc(join(opts.out, 'index.html'))}`)
  for (const r of results) for (const s of r.slides) if (s.flags.length) console.log(C.red(`    ⚠ ${r.variant || 'deck'} slide ${s.index}: ${s.flags.join(', ')}`))
  return flagged
}

function help () {
  console.log(`tahta — visual grading for Slidev decks

  tahta [entry] [options]

  entry              path to slides.md (default: slides.md)
  --variants a,b,c   render each themeConfig.variant (patched in place, restored after)
  --out <dir>        output dir (default: .tahta/grade)
  --serve [port]     serve the report over http (default port 4180, binds 0.0.0.0)
  --open             open the report in the default browser
  --watch            re-grade on file changes
  --timeout <ms>     per-export timeout (default 120000)

  Exit code is non-zero when any slide is flagged (blank/broken) — usable in CI.`)
}

function serve (port) {
  const handler = sirv(opts.out, { dev: true, single: false })
  createServer((req, res) => handler(req, res, () => { res.statusCode = 404; res.end('not found') }))
    .listen(port, '0.0.0.0', () => console.log(`  serving report → ${C.acc(`http://localhost:${port}/`)}  ${C.dim('(0.0.0.0)')}`))
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
  console.log(C.acc('tahta grade'), C.dim(opts.entry))
  let flagged = 0
  try { flagged = await grade() } catch (e) { console.error(C.red('  ' + e.message)) }
  console.log(C.dim(`  done in ${((Date.now() - t0) / 1000).toFixed(1)}s`))
  running = false
  if (queued) { queued = false; run() }
  return flagged
}

const flagged = await run()
if (opts.open) openInBrowser(resolve(opts.out, 'index.html'))
if (opts.serve) serve(opts.serve)
if (opts.watch) {
  const dir = dirname(resolve(opts.entry))
  console.log(C.dim(`  watching ${dir} …`))
  let timer
  fsWatch(dir, { recursive: true }, (_e, f) => {
    if (f && (f.endsWith('.png') || f.includes('.tahta'))) return
    clearTimeout(timer); timer = setTimeout(run, 250)
  })
} else if (!opts.serve) {
  process.exit(flagged ? 1 : 0)
}
