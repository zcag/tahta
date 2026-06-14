<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
// `groups: [{ title, items: [{ term, desc }] }]` or flat `items: [{ term, desc }]`.
const groups = computed(() => {
  if (Array.isArray(fm.groups) && fm.groups.length) return fm.groups
  if (Array.isArray(fm.items)) return [{ items: fm.items }]
  return []
})
</script>

<template>
  <SlideFrame mode="topic">
    <Fit>
      <div class="ref-groups">
        <div v-for="(g, gi) in groups" :key="gi" class="ref-group">
          <div v-if="g.title" class="ref-group-title">{{ g.title }}</div>
          <div class="ref-list">
            <div v-for="(it, i) in (g.items || [])" :key="i" class="ref-row">
              <span class="ref-term" v-html="it.term" /><span class="ref-desc" v-html="it.desc" />
            </div>
          </div>
        </div>
      </div>
    </Fit>
  </SlideFrame>
</template>
