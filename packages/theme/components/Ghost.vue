<script setup>
defineProps({ text: { type: [String, Number], default: '' } })
</script>
<template>
  <div class="ghost" v-if="text !== ''">{{ text }}</div>
</template>
