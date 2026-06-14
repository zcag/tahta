<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
// `left: { title, items: [..] }`, `right: { title, items: [..] }`, optional `label` (default "vs").
const L = computed(() => fm.left || {})
const R = computed(() => fm.right || {})
const label = computed(() => fm.label || 'vs')
</script>

<template>
  <SlideFrame mode="topic">
    <Fit>
      <div class="vs">
        <div class="vs-side a">
          <div class="vs-head" v-html="L.title" />
          <ul><li v-for="(it, i) in (L.items || [])" :key="i" v-html="it" /></ul>
        </div>
        <div class="vs-div">{{ label }}</div>
        <div class="vs-side b">
          <div class="vs-head" v-html="R.title" />
          <ul><li v-for="(it, i) in (R.items || [])" :key="i" v-html="it" /></ul>
        </div>
      </div>
    </Fit>
  </SlideFrame>
</template>
