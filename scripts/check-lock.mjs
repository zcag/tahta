#!/usr/bin/env node
// Lock-sync guard. Regenerates package-lock.json metadata-only in a scratch check and
// fails if it would change — i.e. the lock has drifted from package.json / workspaces
// (a new workspace package, a moved version range). CI runs `npm ci`, which hard-refuses
// a drifted lock, so this catches it locally (pre-push, pre-publish) before it ever
// turns CI red. Side-effect-free: the working-tree lock is restored regardless of outcome.
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const lockPath = `${root}/package-lock.json`
const before = readFileSync(lockPath, 'utf8')

try {
  execFileSync('npm', ['install', '--package-lock-only', '--ignore-scripts', '--silent'],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] })
} catch {
  writeFileSync(lockPath, before)
  console.error('❌ check-lock: `npm install --package-lock-only` failed — resolve deps and retry.')
  process.exit(1)
}

const after = readFileSync(lockPath, 'utf8')
writeFileSync(lockPath, before) // never mutate the working tree from a guard

if (before !== after) {
  console.error('❌ package-lock.json is out of sync with package.json / workspaces.')
  console.error('   Run `npm install`, then commit the regenerated package-lock.json.')
  process.exit(1)
}
console.log('✓ lock in sync')
