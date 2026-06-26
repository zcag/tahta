#!/usr/bin/env node
// Publish gate — runs via the theme's `prepublishOnly`, so EVERY `npm publish` passes
// through it, however it's invoked. Refuses to publish unless:
//   1. the lockfile is in sync (reuses check-lock.mjs), and
//   2. HEAD is committed and its `ci` run on main is green.
// This is the guard that was missing: publishes used to ship straight from the terminal
// while CI sat red for 18 releases, the only signal a buried email. Now a red (or
// still-running, or never-pushed) commit can't be published.
import { execFileSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sh = (cmd, args) => execFileSync(cmd, args, { cwd: root, encoding: 'utf8' }).trim()
const die = (msg) => { console.error(`❌ preflight: ${msg}`); process.exit(1) }

// 1. lockfile in sync
execFileSync('node', [`${root}/scripts/check-lock.mjs`], { cwd: root, stdio: 'inherit' })

// 2. HEAD committed
if (sh('git', ['status', '--porcelain'])) die('working tree is dirty — commit before publishing.')
const sha = sh('git', ['rev-parse', 'HEAD'])

// derive owner/repo from origin (git@…:owner/repo.git or https://…/owner/repo.git)
const origin = sh('git', ['config', '--get', 'remote.origin.url'])
const repo = (origin.match(/[:/]([^/:]+\/[^/]+?)(?:\.git)?$/) || [])[1]
if (!repo) die(`could not parse repo from origin "${origin}".`)

// 3. find this commit's `ci` run on main and require success
let runs
try {
  runs = JSON.parse(sh('gh', ['run', 'list', '--repo', repo, '--branch', 'main',
    '--workflow', 'ci.yml', '--limit', '30',
    '--json', 'headSha,status,conclusion,databaseId']))
} catch {
  die('`gh run list` failed — is the GitHub CLI authed? (publish gate needs it)')
}
const run = runs.find(r => r.headSha === sha)
if (!run) die(`no ci run found for ${sha.slice(0, 7)} on main — push the release commit and let CI run first.`)
if (run.status !== 'completed') die(`ci for ${sha.slice(0, 7)} is still ${run.status} — wait for it to finish (run ${run.databaseId}).`)
if (run.conclusion !== 'success') die(`ci for ${sha.slice(0, 7)} concluded "${run.conclusion}" — fix it before publishing (run ${run.databaseId}).`)

console.log(`✓ preflight: lock in sync · ci green for ${sha.slice(0, 7)} — clear to publish`)
