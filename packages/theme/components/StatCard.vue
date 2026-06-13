<script setup>
defineProps({
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  label: { type: String, default: '' },
  size: { type: String, default: 'text-5xl' },
  accent: { type: Boolean, default: false },
})
</script>

<template>
  <div class="card stat">
    <div :class="['stat-num', size, accent && 'accent-num']">{{ value }}<span class="stat-unit" v-if="unit">{{ unit }}</span></div>
    <div class="stat-label text-sm" v-if="label">{{ label }}</div>
  </div>
</template>
