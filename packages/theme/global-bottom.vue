<script setup>
import { onMounted, watchEffect } from 'vue'
import { useSlideContext } from '@slidev/client'

const ctx = useSlideContext()

// WCAG relative luminance from an "r, g, b" channel list (0..255).
const relLum = (rgb) => { const a = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2] }

// Apply / clear a brand override. On set: --brand (raw) + data-accent='custom' let the CSS keep
// the hue and clamp L/C into the variant's envelope (tokens.css). We then read the CSS-computed
// --accent back and set --on-accent to whichever of dark/light text actually contrasts more —
// the one pick CSS relative-color can't make (it needs luminance, not OKLCH lightness).
function setBrand (root, color) {
  if (color) {
    root.style.setProperty('--brand', color)
    root.dataset.accent = 'custom'
    const probe = document.createElement('span')
    probe.style.cssText = 'color:var(--accent);display:none'
    root.appendChild(probe)
    const ch = getComputedStyle(probe).color.match(/[\d.]+/g)
    root.removeChild(probe)
    if (ch) {
      // crossover luminance where black/white contrast is equal ≈ 0.179
      root.style.setProperty('--on-accent', relLum(ch.map(Number)) > 0.179 ? '#0a0a0c' : '#fafaf8')
    }
  } else {
    root.style.removeProperty('--brand')
    root.style.removeProperty('--on-accent')
    delete root.dataset.accent
  }
}

function apply () {
  if (typeof document === 'undefined') return
  const $s = ctx.$slidev || {}
  const cfg = ($s.configs && $s.configs.themeConfig) || $s.themeConfigs || {}
  // URL params override themeConfig — enables shareable variant URLs (?variant / ?accent / ?lang)
  // that power the live explorer. Harmless in a normal deck (no params = themeConfig wins).
  const q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams()
  const root = document.documentElement
  root.dataset.variant = q.get('variant') || cfg.variant || 'editorial'
  // locale: drives correct text-transform casing (e.g. Turkish i→İ on uppercase kickers)
  const lang = q.get('lang') || cfg.lang
  if (lang) root.lang = lang
  setBrand(root, q.get('accent') || cfg.accent)
}

onMounted(() => {
  apply()
  // live theming without reload — the explorer postMessages variant/accent/lang
  // to the embedded deck (no iframe reload = no flash).
  window.addEventListener('message', (e) => {
    const d = e && e.data
    if (!d || typeof d !== 'object') return
    const root = document.documentElement
    if (d.tahtaVariant) root.dataset.variant = d.tahtaVariant
    if (d.tahtaLang) root.lang = d.tahtaLang
    if (d.tahtaAccent !== undefined) setBrand(root, d.tahtaAccent)
  })
})
watchEffect(apply)
</script>

<template>
  <span style="display:none" />
</template>
