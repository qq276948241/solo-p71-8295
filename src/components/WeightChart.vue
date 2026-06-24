<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { WeightRecord } from '@/types'

const props = defineProps<{
  data: WeightRecord[]
  petName: string
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const renderChart = () => {
  if (!chartRef.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const dates = props.data.map(d => {
    const dt = new Date(d.date)
    return `${dt.getMonth() + 1}月${dt.getDate()}日`
  })
  const weights = props.data.map(d => d.weight)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#FFE4C7',
      borderWidth: 1,
      textStyle: { color: '#4a4036' },
      formatter: (params: any) => {
        const p = params[0]
        return `<div style="padding: 4px 8px;">
          <div style="font-size: 12px; color: #8a7e6e; margin-bottom: 4px;">${p.axisValue}</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #FF8C42;"></span>
            <span>体重: <strong style="color: #FF8C42;">${p.data} kg</strong></span>
          </div>
        </div>`
      },
    },
    grid: {
      left: '8%',
      right: '5%',
      top: '10%',
      bottom: '15%',
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#FFE4C7' } },
      axisLabel: { color: '#8a7e6e', fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: 'kg',
      nameTextStyle: { color: '#8a7e6e', fontSize: 11, padding: [0, 20, 0, 0] },
      axisLine: { show: false },
      axisLabel: { color: '#8a7e6e', fontSize: 11 },
      splitLine: { lineStyle: { color: '#FFF0DF', type: 'dashed' } },
    },
    series: [
      {
        type: 'line',
        data: weights,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#FF8C42' },
        lineStyle: { color: '#FF8C42', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 140, 66, 0.25)' },
            { offset: 1, color: 'rgba(255, 140, 66, 0.02)' },
          ]),
        },
      },
    ],
  }

  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  renderChart()
  window.addEventListener('resize', handleResize)
})

watch(() => props.data, () => {
  renderChart()
}, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<template>
  <div ref="chartRef" class="w-full h-64"></div>
</template>
