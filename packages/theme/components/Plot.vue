<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  type: { type: String, default: 'bar' },           // bar | line | area | donut
  categories: { type: Array, default: () => [] },     // axis labels (bar/line/area) or slice labels (donut)
  series: { type: Array, default: () => [] },          // [{ name, data }]
  unit: { type: String, default: '' },
  height: { type: String, default: '360px' },
  horizontal: { type: Boolean, default: true },        // bar only
})

const el = ref(null)
let chart, probe
const cv = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null

// Resolve a CSS var (incl. relative-color OKLCH) to a hex/rgb string ECharts can parse.
function color (name) {
  if (!probe) { probe = document.createElement('span'); probe.style.cssText = 'position:absolute;visibility:hidden'; document.body.appendChild(probe) }
  probe.style.color = ''
  probe.style.color = `var(${name})`
  const c = getComputedStyle(probe).color
  try { cv.fillStyle = 'rgba(0,0,0,0)'; cv.fillStyle = c; return cv.fillStyle } catch { return c }
}

function build () {
  const accent = color('--accent'), muted = color('--chart-muted'), fg = color('--fg'), dim = color('--fg-dim')
  const pal = ['--cat-1', '--cat-2', '--cat-3', '--cat-4', '--cat-5'].map(color)
  const font = { fontFamily: 'JetBrains Mono', fontSize: 11 }
  const base = { textStyle: { fontFamily: 'Hanken Grotesk, sans-serif', color: fg }, tooltip: { trigger: props.type === 'donut' ? 'item' : 'axis' } }
  const legend = (names) => ({ legend: { data: names, right: 16, top: 2, itemGap: 18, itemWidth: 12, itemHeight: 12, textStyle: { color: dim, ...font } } })

  if (props.type === 'donut') {
    const data = (props.series[0]?.data || []).map((v, i) => ({ value: v, name: props.categories[i] ?? String(i), itemStyle: { color: pal[i % pal.length] } }))
    return {
      ...base,
      ...legend(props.categories),
      series: [{
        type: 'pie', radius: ['54%', '82%'], center: ['50%', '54%'], avoidLabelOverlap: true,
        label: { color: fg, fontFamily: 'Hanken Grotesk', fontSize: 13, formatter: '{b}\n{c}' + props.unit },
        labelLine: { lineStyle: { color: dim } }, data,
      }],
    }
  }

  const names = props.series.map(s => s.name)
  const twoBar = props.type === 'bar' && props.series.length === 2
  const valAxis = { type: 'value', axisLabel: { color: dim, ...font, formatter: '{value}' + props.unit }, splitLine: { lineStyle: { color: 'rgba(127,127,127,0.14)' } }, axisLine: { show: false }, axisTick: { show: false } }
  const catAxis = { type: 'category', data: props.categories, inverse: props.type === 'bar' && props.horizontal, axisLabel: { color: fg, ...font, fontSize: 13 }, axisLine: { show: false }, axisTick: { show: false } }
  const horiz = props.type === 'bar' && props.horizontal
  // Reserve enough left gutter for the WIDEST category label (measured with the mono font),
  // so long labels like "Column store" aren't clipped. ECharts' own containLabel under the
  // SVG renderer under-measures here; an explicit measured width is deterministic. Vertical
  // charts fall back to containLabel (their left axis is the value labels).
  let gridLeft = 48
  if (horiz && cv) {
    cv.font = '13px "JetBrains Mono", ui-monospace, monospace'
    gridLeft = Math.ceil(Math.max(40, ...props.categories.map(c => cv.measureText(String(c ?? '')).width))) + 22
  }
  return {
    ...base,
    ...legend(names),
    grid: horiz ? { left: gridLeft, right: 44, top: 22, bottom: 30 } : { left: 12, right: 36, top: 22, bottom: 30, containLabel: true },
    xAxis: horiz ? valAxis : catAxis,
    yAxis: horiz ? catAxis : valAxis,
    series: props.series.map((s, i) => {
      const c = twoBar ? [muted, accent][i] : pal[i % pal.length]
      if (props.type === 'bar') return { name: s.name, type: 'bar', data: s.data, barWidth: 18, barCategoryGap: '36%', itemStyle: { color: c, borderRadius: horiz ? [0, 3, 3, 0] : [3, 3, 0, 0] }, label: { show: true, position: horiz ? 'right' : 'top', color: i === props.series.length - 1 ? accent : dim, ...font, formatter: '{c}' + props.unit } }
      return { name: s.name, type: 'line', data: s.data, smooth: true, symbol: 'circle', symbolSize: 7, lineStyle: { color: c, width: 3 }, itemStyle: { color: c }, ...(props.type === 'area' ? { areaStyle: { color: c, opacity: 0.14 } } : {}) }
    }),
  }
}

let ro, ready = false
// Render only once the container actually has a size. In Slidev a chart can mount on an
// inactive / 0×0 slide — echarts then warns "Can't get DOM width or height" and paints blank.
// A ResizeObserver inits + paints the moment the slide becomes visible/sized, and re-fits on resize.
function paint () {
  if (!el.value || el.value.clientWidth === 0) return
  if (!chart) chart = echarts.init(el.value, null, { renderer: 'svg' })
  if (!ready) { chart.setOption(build()); ready = true }
  chart.resize()
}
onMounted(() => {
  ro = new ResizeObserver(paint); ro.observe(el.value); paint(); window.addEventListener('resize', paint)
  // Re-measure axis labels once the (mono) font loads. ECharts' containLabel reserves space
  // from the font metrics available at setOption time; if that's a fallback font, the real
  // (wider) label clips. Rebuilding after fonts.ready fixes the gutter width deterministically.
  if (typeof document !== 'undefined' && document.fonts?.ready) document.fonts.ready.then(() => { if (chart) { chart.setOption(build()); chart.resize() } })
})
onBeforeUnmount(() => { ro?.disconnect(); window.removeEventListener('resize', paint); chart?.dispose(); probe?.remove() })
</script>

<template>
  <div ref="el" :style="{ width: '100%', height }"></div>
</template>
