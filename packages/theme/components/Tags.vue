<script setup>
// A row of keyword chips. Tech stacks, topics, skills.
//   <Tags :items="['TypeScript', 'Vue', 'Vite']" />
defineProps({ items: { type: Array, default: () => [] } })
</script>

<template>
  <span class="tags"><span v-for="(t, i) in items" :key="i" class="tag" v-html="t" /></span>
</template>
