<script setup>
import { onMounted, watchEffect } from 'vue'
import { useSlideContext } from '@slidev/client'

const ctx = useSlideContext()

function apply () {
  if (typeof document === 'undefined') return
  const $s = ctx.$slidev || {}
  const cfg = ($s.configs && $s.configs.themeConfig) || $s.themeConfigs || {}
  const root = document.documentElement
  root.dataset.variant = cfg.variant || 'editorial'
  // locale: drives correct text-transform casing (e.g. Turkish i→İ on uppercase kickers)
  if (cfg.lang) root.lang = cfg.lang
  if (cfg.accent) {
    root.style.setProperty('--accent', cfg.accent)
    root.style.setProperty('--accent-2', cfg.accent)
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
