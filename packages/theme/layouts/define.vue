<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
// `term`, `definition`, optional `points: [..]`. For "What is X?" slides.
</script>

<template>
  <SlideFrame mode="topic">
    <Reveal>
      <div class="define-term" v-html="fm.term" />
      <div v-if="fm.definition" class="define-body" v-html="fm.definition" />
      <ul v-if="Array.isArray(fm.points)" class="define-points">
        <li v-for="(p, i) in fm.points" :key="i" v-html="p" />
      </ul>
    </Reveal>
  </SlideFrame>
</template>
