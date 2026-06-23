<script setup>
import { computed } from 'vue'
// A token-themed cell grid for the things Mermaid draws badly: memory / byte layouts,
// row-store vs column-store, matrices, a schema table. `data` is a 2D array of cells;
// `head` treats the first row as a header; `highlight` accents a row / column / cell to
// make a point ("a column store reads just THIS column").
const props = defineProps({
  data: { type: Array, default: () => [] },
  head: { type: Boolean, default: false },
  highlight: { type: String, default: '' }, // "row:N" | "col:N" | "cell:R,C"  (0-based)
})

const hi = computed(() => {
  const m = /^(row|col|cell):(.+)$/.exec(String(props.highlight).trim())
  if (!m) return { kind: '', a: -1, b: -1 }
  const [a, b] = m[2].split(',').map((n) => Number(n.trim()))
  return { kind: m[1], a, b: Number.isNaN(b) ? -1 : b }
})

const on = (r, c) => {
  const { kind, a, b } = hi.value
  if (kind === 'row') return r === a
  if (kind === 'col') return c === a
  if (kind === 'cell') return r === a && c === b
  return false
}

const cols = computed(() => props.data[0]?.length || 1)
</script>

<template>
  <div class="tahta-grid" :style="{ '--grid-cols': cols }">
    <template v-for="(row, r) in data" :key="r">
      <div
        v-for="(cell, c) in row" :key="c" class="grid-cell"
        :class="{ 'is-head': head && r === 0, 'is-hi': on(r, c) }"
        v-html="cell"
      />
    </template>
  </div>
</template>
