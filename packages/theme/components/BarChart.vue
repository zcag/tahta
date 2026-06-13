<script setup>
// Back-compat alias — BarChart is now Chart with type="bar".
defineProps({
  categories: { type: Array, default: () => [] },
  series: { type: Array, default: () => [] },
  unit: { type: String, default: '' },
  height: { type: String, default: '360px' },
  horizontal: { type: Boolean, default: true },
})
</script>

<template>
  <Plot type="bar" :categories="categories" :series="series" :unit="unit" :height="height" :horizontal="horizontal" />
</template>
