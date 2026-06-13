<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-end">
    <div class="glow"></div>
    <div class="l-center middle">
      <div class="accent-bar mb-8"></div>
      <h1 class="text-7xl" v-html="$frontmatter.title || 'Thanks'"></h1>
      <div class="text-xl mt-4" style="color:var(--fg-dim)" v-if="$frontmatter.subtitle" v-html="$frontmatter.subtitle"></div>
      <div class="kicker mt-8" style="justify-content:center" v-if="$frontmatter.contact">{{ $frontmatter.contact }}</div>
      <slot />
    </div>
    <Foot />
  </div>
</template>
