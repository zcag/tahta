import { spawn } from 'node:child_process'
import { rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

/** Run `slidev export --format png` for one deck into outDir. */
export function exportDeck (entry, outDir, { timeout = 120000 } = {}) {
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })
  return new Promise((resolve, reject) => {
    const p = spawn('npx', ['slidev', 'export', entry, '--format', 'png', '--output', outDir, '--timeout', String(timeout)],
      { stdio: ['ignore', 'ignore', 'inherit'] })
    p.on('error', reject)
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`slidev export exited ${code}`)))
  })
}

/** Temporarily set `themeConfig.variant` in a deck's frontmatter, run fn, then restore. */
export async function withVariant (entry, variant, fn) {
  if (!variant) return fn()
  const original = readFileSync(entry, 'utf8')
  try {
    let patched
    if (/^\s*variant:\s*.*$/m.test(original)) {
      patched = original.replace(/^(\s*)variant:\s*.*$/m, `$1variant: ${variant}`)
    } else if (/^themeConfig:/m.test(original)) {
      patched = original.replace(/^themeConfig:\s*$/m, `themeConfig:\n  variant: ${variant}`)
    } else {
      // inject a themeConfig into the first frontmatter block
      patched = original.replace(/^---\n/, `---\nthemeConfig:\n  variant: ${variant}\n`)
    }
    writeFileSync(entry, patched)
    return await fn()
  } finally {
    writeFileSync(entry, original)
  }
}
