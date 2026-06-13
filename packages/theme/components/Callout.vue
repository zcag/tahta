<script setup>
defineProps({ icon: { type: String, default: 'lucide:info' } })
</script>
<template>
  <div class="callout">
    <Icon :name="icon" />
    <div class="callout-body"><slot /></div>
  </div>
</template>
