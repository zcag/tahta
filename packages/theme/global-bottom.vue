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

onMounted(apply)
watchEffect(apply)
</script>

<template>
  <span style="display:none" />
</template>
