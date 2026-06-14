<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
// Code in the slide body (a fenced code block), numbered explanation in `notes: [..]`.
const notes = computed(() => fm.notes || [])
</script>

<template>
  <SlideFrame mode="topic">
    <div class="code-explain">
      <div class="ce-code"><slot /></div>
      <div class="explain-notes">
        <div v-for="(n, i) in notes" :key="i" class="explain-note"><span v-html="n" /></div>
      </div>
    </div>
  </SlideFrame>
</template>
