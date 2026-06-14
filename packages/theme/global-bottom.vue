<script setup>
import { onMounted, watchEffect } from 'vue'
import { useSlideContext } from '@slidev/client'

const ctx = useSlideContext()

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
  const accent = q.get('accent') || cfg.accent
  if (accent) {
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--accent-2', accent)
  } else {
    root.style.removeProperty('--accent')
    root.style.removeProperty('--accent-2')
  }
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
    if (d.tahtaAccent !== undefined) {
      if (d.tahtaAccent) { root.style.setProperty('--accent', d.tahtaAccent); root.style.setProperty('--accent-2', d.tahtaAccent) }
      else { root.style.removeProperty('--accent'); root.style.removeProperty('--accent-2') }
    }
  })
})
watchEffect(apply)
</script>

<template>
  <span style="display:none" />
</template>
