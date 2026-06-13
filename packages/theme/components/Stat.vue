<script setup>
const SIZES = { sm: 'fs-stat-sm', md: 'fs-stat-md', lg: 'fs-stat-lg', xl: 'fs-stat-xl' }
defineProps({
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  label: { type: String, default: '' },
  size: { type: String, default: 'xl' },
  accent: { type: Boolean, default: true },
  icon: { type: String, default: '' },
})
</script>

<template>
  <div class="stat">
    <Icon v-if="icon" :name="icon" class="stat-icon" />
    <div :class="['stat-num', SIZES[size] || SIZES.xl, accent && 'accent-num']">{{ value }}<span v-if="unit" class="stat-unit">{{ unit }}</span></div>
    <div v-if="label" class="stat-label">{{ label }}</div>
  </div>
</template>
