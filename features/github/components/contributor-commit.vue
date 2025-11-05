<script setup lang="ts">
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useContributors } from "../composables/use-contributors";

echarts.use([
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

const props = defineProps<{ owner: string; repo: string }>();
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const { monthlyDensity, isLoadingStats, errorStats, fetchContributorStats } =
  useContributors(props.owner, props.repo);

const chartEl = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

function renderChart() {
  if (!chartEl.value) return;
  if (!chart)
    chart = echarts.init(chartEl.value, undefined, { renderer: "canvas" });

  const months = monthlyDensity.value.months;
  const series = monthlyDensity.value.series.map((s) => ({
    name: s.name,
    type: "bar",
    stack: "total",
    emphasis: { focus: "series" },
    data: s.data,
  }));

  chart.setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    legend: {
      bottom: 0,
      left: "center",
      type: "scroll",
      textStyle: { color: isDark.value ? "#e5e7eb" : "#111827" },
      pageTextStyle: { color: isDark.value ? "#9ca3af" : "#4b5563" },
    },
    grid: { left: 40, right: 20, top: 30, bottom: 70 },
    xAxis: {
      type: "category",
      data: months,
      axisLabel: { color: isDark.value ? "#9ca3af" : "#4b5563" },
      axisLine: { lineStyle: { color: isDark.value ? "#374151" : "#e5e7eb" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: isDark.value ? "#9ca3af" : "#4b5563" },
      splitLine: { lineStyle: { color: isDark.value ? "#374151" : "#e5e7eb" } },
    },
    series,
  });
}

watch([monthlyDensity, isDark], () => {
  nextTick(() => renderChart());
});

onMounted(() => {
  fetchContributorStats().then(() => renderChart());
  window.addEventListener("resize", () => chart?.resize());
});

onBeforeUnmount(() => {
  chart?.dispose();
  chart = null;
});
</script>

<template>
  <div
    :class="
      cn('rounded-lg border p-6 bg-white border-gray-200', {
        'bg-gray-900 border-gray-800': isDark,
      })
    "
  >
    <h3
      :class="
        cn('text-lg font-semibold mb-4 text-gray-900', { 'text-white': isDark })
      "
    >
      Commit Density by Contributor
    </h3>

    <div
      v-if="isLoadingStats"
      class="py-8 text-center"
      :class="cn('text-gray-600', { 'text-gray-400': isDark })"
    >
      Loading...
    </div>
    <div
      v-else-if="errorStats"
      class="py-8 text-center text-red-600"
      :class="{ 'text-red-400': isDark }"
    >
      {{ errorStats }}
    </div>

    <div v-else>
      <div
        v-if="!monthlyDensity.series.length"
        class="py-8 text-center"
        :class="cn('text-gray-600', { 'text-gray-400': isDark })"
      >
        No stats available
      </div>
      <div v-else ref="chartEl" class="w-full h-[360px]" />
    </div>
  </div>
</template>
