<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-statement">
    <div class="glow" v-if="$frontmatter.glow !== false"></div>
    <Ghost :text="$frontmatter.ghost ?? ''" />
    <div class="l-center">
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <h2 class="text-4xl mb-10" v-if="$frontmatter.title" v-html="$frontmatter.title"></h2>
      <slot />
    </div>
    <Foot />
  </div>
</template>
