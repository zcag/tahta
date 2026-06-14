<script setup>
const TONES = { good: '--good', warn: '--warn', bad: '--bad', info: '--info', accent: '--accent' }
defineProps({ tone: { type: String, default: 'accent' } })   // good | warn | bad | info | accent
</script>
<template>
  <span class="badge" :style="{ '--tone': `var(${TONES[tone] || '--accent'})` }"><slot /></span>
</template>
