<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<template>
  <SlideFrame mode="statement">
    <div class="quote-mark mb-3">&ldquo;</div>
    <div class="quote-body fs-quote mw-quote" v-html="$frontmatter.quote" />
    <div v-if="$frontmatter.author" class="kicker mt-10">{{ $frontmatter.author }}</div>
  </SlideFrame>
</template>
