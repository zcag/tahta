<script setup>
const TONES = { good: '--good', warn: '--warn', bad: '--bad', info: '--info', accent: '--accent' }
const props = defineProps({
  icon: { type: String, default: 'lucide:info' },
  tone: { type: String, default: 'accent' },   // good | warn | bad | info | accent
})
</script>
<template>
  <div class="callout" :style="{ '--tone': `var(${TONES[tone] || '--accent'})` }">
    <Icon :name="icon" />
    <div class="callout-body"><slot /></div>
  </div>
</template>
