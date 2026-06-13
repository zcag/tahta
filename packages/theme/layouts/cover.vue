<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-cover">
    <div class="glow"></div>
    <div class="l-center">
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <h1 class="text-7xl" style="max-width: 17ch" v-html="$frontmatter.title"></h1>
      <div class="text-2xl mt-5" style="color:var(--fg-dim); max-width:44ch" v-if="$frontmatter.subtitle" v-html="$frontmatter.subtitle"></div>
      <slot />
    </div>
    <Foot />
  </div>
</template>
