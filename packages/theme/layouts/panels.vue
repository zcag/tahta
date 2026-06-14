<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
// `panels: [{ title, icon?, items?: [..], body?: "<html>" }]` — 2–4 carded sub-topics.
const panels = computed(() => fm.panels || [])
const two = computed(() => panels.value.length === 2 || panels.value.length === 4)
</script>

<template>
  <SlideFrame mode="topic">
    <Fit>
      <div class="panels" :class="{ two }">
        <div v-for="(p, i) in panels" :key="i" class="panel">
          <div class="panel-title"><Icon v-if="p.icon" :name="p.icon" /><span v-html="p.title" /></div>
          <div class="panel-body">
            <ul v-if="Array.isArray(p.items)"><li v-for="(it, j) in p.items" :key="j" v-html="it" /></ul>
            <div v-else-if="p.body" v-html="p.body" />
          </div>
        </div>
      </div>
    </Fit>
  </SlideFrame>
</template>
