<script setup>
import { computed } from 'vue'
// Labeled progress / percentage bar. Roadmaps, OKRs, capacity.
//   <Meter value="72" label="Migration" />  ·  <Meter value="3" max="5" display="3 / 5" tone="warn" label="Hardening" />
const props = defineProps({
  value: { type: [Number, String], default: 0 },
  max: { type: [Number, String], default: 100 },
  label: { type: String, default: '' },
  display: { type: String, default: '' },
  tone: { type: String, default: '' }       // good | warn | bad | info | accent
})
const pct = computed(() => {
  const v = Number(props.value), m = Number(props.max) || 100
  return Math.max(0, Math.min(100, (v / m) * 100))
})
const toneVar = computed(() => (props.tone ? { '--tone': `var(--${props.tone})` } : null))
</script>

<template>
  <div class="meter" :style="toneVar">
    <div v-if="label || display" class="meter-head">
      <span class="meter-label" v-html="label" />
      <span class="meter-val">{{ display || Math.round(pct) + '%' }}</span>
    </div>
    <div class="meter-track"><div class="meter-fill" :style="{ width: pct + '%' }" /></div>
  </div>
</template>
