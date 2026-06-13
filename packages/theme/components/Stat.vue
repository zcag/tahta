<script setup>
defineProps({
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  label: { type: String, default: '' },
  size: { type: String, default: 'text-8xl' },
  accent: { type: Boolean, default: true },
})
</script>

<template>
  <div class="stat">
    <div :class="['stat-num', size, accent && 'accent-num']">{{ value }}<span class="stat-unit" v-if="unit">{{ unit }}</span></div>
    <div class="stat-label" v-if="label">{{ label }}</div>
  </div>
</template>
