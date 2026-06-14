#!/usr/bin/env node
// Build tahta.cagdas.io into dist/: landing + live gallery explorer + example deck SPAs.
import { rmSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://tahta.cagdas.io'

const build = (entry, base, out) => {
  console.log(`▶ ${base}`)
  const r = spawnSync('npx', ['slidev', 'build', join(root, entry), '--base', base, '--out', join(dist, out)],
    { stdio: ['ignore', 'ignore', 'inherit'] })
  if (r.status !== 0) { console.error(`build failed: ${entry}`); process.exit(1) }
}

rmSync(dist, { recursive: true, force: true }); mkdirSync(dist, { recursive: true })

// gallery = the explorer; examples = live decks
build('examples/gallery/slides.md', '/gallery/', 'gallery')
for (const d of ['edge', 'talk', 'pitch', 'report', 'teach']) build(`examples/${d}/slides.md`, `/decks/${d}/`, `decks/${d}`)

// landing + assets
copyFileSync(join(root, 'site/index.html'), join(dist, 'index.html'))
copyFileSync(join(root, 'docs/assets/variants.png'), join(dist, 'variants.png'))
copyFileSync(join(root, 'docs/assets/layouts.png'), join(dist, 'layouts.png'))

// SEO basics
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`)
const urls = ['/', '/gallery/', '/decks/talk/', '/decks/pitch/', '/decks/report/', '/decks/edge/', '/decks/teach/']
writeFileSync(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n') + `\n</urlset>\n`)

console.log(`\n✓ site → dist/  (landing + gallery explorer + ${5} example decks)`)
