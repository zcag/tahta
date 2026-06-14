<script setup>
// Image (or slotted diagram) with caption + optional credit. The basic figure primitive.
//   <Figure src="/chart.png" caption="Revenue, last 6 quarters" credit="internal" />
// Images go in the deck's public/ and are referenced as /name.png.
defineProps({ src: String, alt: String, caption: String, credit: String })
</script>

<template>
  <figure class="tahta-figure">
    <img v-if="src" :src="src" :alt="alt || caption || ''" />
    <div v-else class="tf-slot"><slot /></div>
    <figcaption v-if="caption || credit">
      <span v-if="caption" v-html="caption" />
      <span v-if="credit" class="tf-credit">{{ credit }}</span>
    </figcaption>
  </figure>
</template>
