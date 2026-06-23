<script setup>
import { ref, onMounted } from 'vue'
// Count a number up from 0 on entry — the "big figure lands" beat. Automatic, like the
// theme's entrance motion. Only animates a PLAIN number (incl. commas/decimals); anything
// else (∞, −80%, "v2.0.1") renders verbatim. Skipped under reduced-motion AND in print/
// export — there it shows the final value immediately so the static frame is correct.
const props = defineProps({
  value: { type: [String, Number], default: '' },
  dur: { type: Number, default: 850 },
})
const out = ref(String(props.value ?? ''))

function parse (v) {
  const s = String(v).trim()
  if (!/\d/.test(s) || !/^-?[\d,]*\.?\d+$/.test(s)) return null
  return { n: parseFloat(s.replace(/,/g, '')), dec: (s.split('.')[1] || '').length, grp: s.includes(',') }
}

onMounted(() => {
  const final = String(props.value ?? '')
  const p = parse(props.value)
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const print = typeof document !== 'undefined' && !!document.querySelector('.print, .slidev-print, [data-print], .export')
  if (!p || reduce || print) { out.value = final; return }
  const fmt = (x) => {
    const f = x.toFixed(p.dec)
    return p.grp ? Number(f).toLocaleString('en-US', { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec }) : f
  }
  const ease = (t) => 1 - Math.pow(1 - t, 3)
  let start
  out.value = fmt(0)
  const step = (now) => {
    start ??= now
    const t = Math.min(1, (now - start) / props.dur)
    out.value = fmt(p.n * ease(t))
    if (t < 1) requestAnimationFrame(step)
    else out.value = final
  }
  requestAnimationFrame(step)
})
</script>

<template><span class="tahta-num">{{ out }}</span></template>
