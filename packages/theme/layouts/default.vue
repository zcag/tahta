<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-topic">
    <Ghost :text="$frontmatter.ghost ?? ''" />
    <div class="l-head" v-if="$frontmatter.kicker || $frontmatter.title">
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <h2 class="text-4xl" v-if="$frontmatter.title" v-html="$frontmatter.title"></h2>
    </div>
    <div class="l-body"><slot /></div>
    <Foot />
  </div>
</template>
