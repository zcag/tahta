<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-statement">
    <div class="glow"></div>
    <div class="l-center">
      <div class="quote-mark mb-3">&ldquo;</div>
      <div class="quote-body text-6xl" style="max-width: 20ch" v-html="$frontmatter.quote"></div>
      <div class="kicker mt-10" v-if="$frontmatter.author">{{ $frontmatter.author }}</div>
    </div>
    <Foot />
  </div>
</template>
