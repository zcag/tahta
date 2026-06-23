<script setup>
const SIZES = { sm: 'fs-stat-sm', md: 'fs-stat-md', lg: 'fs-stat-lg', xl: 'fs-stat-xl' }
const TONES = { good: '--good', warn: '--warn', bad: '--bad', info: '--info', accent: '--accent' }
const props = defineProps({
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  label: { type: String, default: '' },
  size: { type: String, default: 'xl' },
  accent: { type: Boolean, default: true },
  icon: { type: String, default: '' },
  tone: { type: String, default: '' },   // optional semantic color override
})
const toneStyle = props.tone ? { color: `var(${TONES[props.tone] || '--accent'})` } : null
</script>

<template>
  <div class="stat">
    <Icon v-if="icon" :name="icon" class="stat-icon" :style="toneStyle" />
    <div :class="['stat-num', SIZES[size] || SIZES.xl, accent && !tone && 'accent-num']" :style="toneStyle"><Num :value="value" /><span v-if="unit" class="stat-unit" :style="toneStyle">{{ unit }}</span></div>
    <div v-if="label" class="stat-label">{{ label }}</div>
  </div>
</template>
