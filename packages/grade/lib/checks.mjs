import { spawn } from 'node:child_process'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function waitFor (url, timeout = 40000) {
  const t0 = Date.now()
  while (Date.now() - t0 < timeout) {
    try { const r = await fetch(url); if (r.ok) return true } catch {}
    await sleep(400)
  }
  throw new Error('dev server did not start')
}

/**
 * DOM-level checks that a PNG can't see: content overflow (clipped) and text contrast.
 * Boots `slidev <entry>` (rendering whatever variant the deck is currently set to),
 * drives playwright-chromium, returns one record per slide. Opt-in (--checks) — needs playwright.
 */
export async function runChecks (entry, count, { port = 31415 } = {}) {
  let chromium
  try { ({ chromium } = await import('playwright-chromium')) }
  catch { console.warn('  (checks skipped: playwright-chromium not installed)'); return null }

  const server = spawn('npx', ['slidev', entry, '--port', String(port)], { stdio: 'ignore' })
  let browser
  try {
    await waitFor(`http://localhost:${port}/`)
    browser = await chromium.launch()
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
    const out = []
    for (let i = 1; i <= count; i++) {
      try {
        await page.goto(`http://localhost:${port}/${i}`, { waitUntil: 'networkidle', timeout: 15000 })
      } catch {}
      await sleep(250)
      out.push(await page.evaluate(measure))
    }
    return out
  } finally {
    if (browser) await browser.close().catch(() => {})
    server.kill('SIGTERM')
  }
}

/* runs in the page */
function measure () {
  const els = [...document.querySelectorAll('.slidev-layout')]
  const el = els.find(e => e.getBoundingClientRect().width > 50) || els[0]
  if (!el) return { overflow: false, contrast: null }
  // decorative elements (ghost numeral, glow, bleed art) intentionally bleed past the frame —
  // hide them so they don't masquerade as content overflow, measure, then restore.
  const deco = [...el.querySelectorAll('.ghost, .glow, .bleed-img, .bleed-duotone, .bleed-scrim')]
  const prev = deco.map(d => d.style.display)
  deco.forEach(d => { d.style.display = 'none' })
  const overflow = (el.scrollHeight - el.clientHeight > 4) || (el.scrollWidth - el.clientWidth > 4)
  deco.forEach((d, i) => { d.style.display = prev[i] })
  const px = (c) => (c.match(/[\d.]+/g) || [0, 0, 0]).map(Number)
  const lum = ([r, g, b]) => { const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2] }
  const ratio = (f, b) => { const L1 = lum(f), L2 = lum(b), hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05) }
  let contrast = null
  const h = el.querySelector('h1, h2, .stat-num')
  if (h) { try { contrast = +ratio(px(getComputedStyle(h).color), px(getComputedStyle(el).backgroundColor)).toFixed(2) } catch {} }
  return { overflow, contrast }
}
