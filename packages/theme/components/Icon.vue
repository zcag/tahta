<script setup>
import { Icon as Iconify, addCollection } from '@iconify/vue'
import lucide from '@iconify-json/lucide/icons.json'

// Bundle the collection so icons render offline (export-safe) — no runtime API fetch.
addCollection(lucide)

defineProps({
  name: { type: String, required: true },   // e.g. "lucide:zap"
  size: { type: String, default: '1em' },
})
</script>

<template>
  <Iconify :icon="name" :width="size" :height="size" class="tahta-icon" />
</template>
