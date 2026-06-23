<script setup>
import { useSlideContext } from '@slidev/client'
import { tex } from '../lib/tex.mjs'
const { $frontmatter: fm } = useSlideContext()
// `term`, `definition`, optional `points: [..]`. For "What is X?" slides.
// definition/points support $inline$ and $$block$$ math (via tex()).
</script>

<template>
  <SlideFrame mode="topic">
    <Reveal>
      <div class="define-term" v-html="tex(fm.term)" />
      <div v-if="fm.definition" class="define-body" v-html="tex(fm.definition)" />
      <ul v-if="Array.isArray(fm.points)" class="define-points">
        <li v-for="(p, i) in fm.points" :key="i" v-html="tex(p)" />
      </ul>
    </Reveal>
  </SlideFrame>
</template>
