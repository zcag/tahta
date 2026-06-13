<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>
<template>
  <SlideFrame mode="topic">
    <div class="embed" style="aspect-ratio:16/9; height:auto; max-width:62rem; margin:0 auto">
      <iframe v-if="$frontmatter.iframe" :src="$frontmatter.iframe" allowfullscreen />
      <video v-else-if="$frontmatter.video" :src="$frontmatter.video" controls />
      <slot v-else />
    </div>
  </SlideFrame>
</template>
