<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-topic">
    <div class="glow"></div>
    <Ghost :text="$frontmatter.index ?? ''" />
    <div class="l-body">
      <div class="stat-num accent-num text-3xl mb-4" v-if="$frontmatter.index">{{ $frontmatter.index }}</div>
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <h1 class="text-7xl" style="max-width: 18ch" v-html="$frontmatter.title"></h1>
      <div class="text-xl mt-5" style="color:var(--fg-dim); max-width:46ch" v-if="$frontmatter.subtitle" v-html="$frontmatter.subtitle"></div>
    </div>
    <Foot />
  </div>
</template>
