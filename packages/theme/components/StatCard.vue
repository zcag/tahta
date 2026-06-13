<script setup>
const SIZES = { sm: 'fs-stat-sm', md: 'fs-stat-md', lg: 'fs-stat-lg', xl: 'fs-stat-xl' }
defineProps({
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  label: { type: String, default: '' },
  size: { type: String, default: 'md' },
  accent: { type: Boolean, default: false },
  icon: { type: String, default: '' },
})
</script>

<template>
  <div class="card stat">
    <Icon v-if="icon" :name="icon" class="stat-icon" />
    <div :class="['stat-num', SIZES[size] || SIZES.md, accent && 'accent-num']">{{ value }}<span v-if="unit" class="stat-unit">{{ unit }}</span></div>
    <div v-if="label" class="stat-label">{{ label }}</div>
  </div>
</template>
