<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
// Brand logo from themeConfig.logo. mode='hero' (prominent, on openers) | 'mark' (small, footer).
// Renders nothing when no logo is configured, so it's inert on a non-branded deck.
defineProps({ mode: { type: String, default: 'mark' } })
const { $slidev } = useSlideContext()
const cfg = computed(() => $slidev?.configs?.themeConfig || {})
const src = computed(() => cfg.value.logo || '')
const invert = computed(() => cfg.value.logoInvert === true)
</script>

<template>
  <img v-if="src" :src="src" alt="" :class="['brand-logo', mode, { invert }]" />
</template>
