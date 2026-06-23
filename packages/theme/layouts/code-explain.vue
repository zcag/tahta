<script setup>
import { computed } from 'vue'
import { useSlideContext, useNav } from '@slidev/client'
const { $frontmatter: fm, $clicks } = useSlideContext()
const { clicksTotal } = useNav()
// Code in the slide body (a fenced block), numbered explanation in `notes: [..]`.
// If the code steps its line highlight per click (e.g. ```sql {1|2|4} ```), the notes
// sync: the note matching the current click lights up while the rest dim — so the
// spoken note and the highlighted line advance together. Static (no click highlight) →
// every note shows equally.
const notes = computed(() => fm.notes || [])
const stepped = computed(() => (clicksTotal?.value ?? 0) > 0)
const cur = computed(() => $clicks?.value ?? 0)
</script>

<template>
  <SlideFrame mode="topic">
    <div class="code-explain">
      <div class="ce-code"><slot /></div>
      <div class="explain-notes">
        <div
          v-for="(n, i) in notes" :key="i" class="explain-note"
          :class="{ 'note-active': stepped && i === cur, 'note-idle': stepped && i !== cur }"
        ><span v-html="n" /></div>
      </div>
    </div>
  </SlideFrame>
</template>
