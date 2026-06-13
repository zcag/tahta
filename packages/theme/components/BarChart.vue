<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  categories: { type: Array, required: true },     // ['p50','p95','cold start']
  series: { type: Array, required: true },          // [{name:'Before',data:[..]},{name:'After',data:[..]}]
  unit: { type: String, default: '' },              // 'ms'
  height: { type: String, default: '360px' },
  horizontal: { type: Boolean, default: true },
})

const el = ref(null)
let chart
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()

function build () {
  const accent = css('--accent') || '#6aa0f0'
  const dim = css('--chart-muted') || '#667085'
  const fg = css('--fg') || '#e9ecf2', label = css('--fg-dim') || '#98a1b3'
  const palette = [dim, accent, accent]
  const valAxis = {
    type: 'value',
    axisLabel: { color: '#5b6273', fontFamily: 'JetBrains Mono', fontSize: 11, formatter: '{value}' + props.unit },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    axisLine: { show: false }, axisTick: { show: false },
  }
  const catAxis = {
    type: 'category', data: props.categories, inverse: props.horizontal,
    axisLabel: { color: fg, fontFamily: 'JetBrains Mono', fontSize: 13 },
    axisLine: { show: false }, axisTick: { show: false },
  }
  return {
    textStyle: { fontFamily: 'Hanken Grotesk, sans-serif', color: fg },
    grid: { left: props.horizontal ? 96 : 40, right: 64, top: 18, bottom: 30 },
    legend: { data: props.series.map(s => s.name), right: 16, top: 2, itemGap: 18,
      textStyle: { color: label, fontFamily: 'JetBrains Mono', fontSize: 11 }, itemWidth: 12, itemHeight: 12 },
    tooltip: { trigger: 'axis' },
    xAxis: props.horizontal ? valAxis : catAxis,
    yAxis: props.horizontal ? catAxis : valAxis,
    series: props.series.map((s, i) => ({
      name: s.name, type: 'bar', data: s.data, barWidth: 18, barCategoryGap: '36%',
      itemStyle: { color: palette[i % palette.length], borderRadius: props.horizontal ? [0,3,3,0] : [3,3,0,0] },
      label: { show: true, position: props.horizontal ? 'right' : 'top',
        color: i === props.series.length - 1 ? accent : label,
        fontFamily: 'JetBrains Mono', fontWeight: i === props.series.length - 1 ? 700 : 400,
        fontSize: 11, formatter: '{c}' + props.unit },
    })),
  }
}

function resize () { chart?.resize() }
onMounted(() => { chart = echarts.init(el.value, null, { renderer: 'svg' }); chart.setOption(build()); window.addEventListener('resize', resize) })
watch(() => [props.categories, props.series], () => chart?.setOption(build(), true), { deep: true })
onBeforeUnmount(() => { window.removeEventListener('resize', resize); chart?.dispose() })
</script>

<template>
  <div ref="el" :style="{ width: '100%', height }"></div>
</template>
