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
  return {
    ...base,
    ...legend(names),
    grid: { left: horiz ? 96 : 48, right: 30, top: 22, bottom: 30 },
    xAxis: horiz ? valAxis : catAxis,
    yAxis: horiz ? catAxis : valAxis,
    series: props.series.map((s, i) => {
      const c = twoBar ? [muted, accent][i] : pal[i % pal.length]
      if (props.type === 'bar') return { name: s.name, type: 'bar', data: s.data, barWidth: 18, barCategoryGap: '36%', itemStyle: { color: c, borderRadius: horiz ? [0, 3, 3, 0] : [3, 3, 0, 0] }, label: { show: true, position: horiz ? 'right' : 'top', color: i === props.series.length - 1 ? accent : dim, ...font, formatter: '{c}' + props.unit } }
      return { name: s.name, type: 'line', data: s.data, smooth: true, symbol: 'circle', symbolSize: 7, lineStyle: { color: c, width: 3 }, itemStyle: { color: c }, ...(props.type === 'area' ? { areaStyle: { color: c, opacity: 0.14 } } : {}) }
    }),
  }
}

function resize () { chart?.resize() }
onMounted(() => { chart = echarts.init(el.value, null, { renderer: 'svg' }); chart.setOption(build()); window.addEventListener('resize', resize) })
onBeforeUnmount(() => { window.removeEventListener('resize', resize); chart?.dispose(); probe?.remove() })
</script>

<template>
  <div ref="el" :style="{ width: '100%', height }"></div>
</template>
