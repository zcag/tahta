<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const steps = computed(() => $frontmatter.steps || [])
</script>

<template>
  <div class="slidev-layout l-topic">
    <Ghost :text="$frontmatter.ghost ?? ''" />
    <div class="l-head" v-if="$frontmatter.kicker || $frontmatter.title">
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <h2 class="text-4xl" v-if="$frontmatter.title" v-html="$frontmatter.title"></h2>
    </div>
    <div class="l-body">
      <div class="steps">
        <template v-for="(s, i) in steps" :key="i">
          <div class="card" style="flex:1">
            <div class="step-title">{{ s.title }}</div>
            <div class="step-desc">{{ s.desc }}</div>
          </div>
          <div class="arrow" v-if="i < steps.length - 1">→</div>
        </template>
      </div>
    </div>
    <Foot />
  </div>
</template>
