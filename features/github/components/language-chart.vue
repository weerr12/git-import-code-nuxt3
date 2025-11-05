<script setup lang="ts">
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";
import { useRepositoryLanguages } from "~/features/github/composables/use-repository-languages";

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

const props = defineProps<{
  owner: string;
  repo: string;
}>();

const colorMode = useColorMode();

const chartRef = ref<HTMLDivElement | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);

const { languages, isLoading, error, fetchLanguages } =
  useRepositoryLanguages();

const chartOptions = computed<EChartsOption>(() => {
  const isDark = colorMode.preference === "dark";

  return {
    backgroundColor: "transparent",
    title: {
      text: "Language Composition",
      left: "center",
      top: 0,
      textStyle: {
        color: isDark ? "#e5e7eb" : "#1f2937",
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} bytes ({d}%)",
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      borderColor: isDark ? "#374151" : "#e5e7eb",
      textStyle: {
        color: isDark ? "#e5e7eb" : "#1f2937",
      },
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
      textStyle: {
        color: isDark ? "#e5e7eb" : "#1f2937",
        fontSize: 12,
      },
      formatter: (name: string) => {
        const lang = languages.value.find((l) => l.language === name);
        return lang ? `${name} ${lang.percentage.toFixed(1)}%` : name;
      },
    },
    series: [
      {
        name: "Languages",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["35%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: isDark ? "#1f2937" : "#ffffff",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
            color: isDark ? "#e5e7eb" : "#1f2937",
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: {
          show: false,
        },
        data: languages.value.map((lang) => ({
          name: lang.language,
          value: lang.bytes,
          itemStyle: {
            color: lang.color,
          },
        })),
      },
    ],
  };
});

const initChart = () => {
  if (!chartRef.value) return;

  if (chartInstance.value) {
    chartInstance.value.dispose();
  }

  chartInstance.value = echarts.init(chartRef.value);
  chartInstance.value.setOption(chartOptions.value);
};

watch(
  [languages, () => colorMode.preference],
  () => {
    if (chartInstance.value && languages.value.length > 0) {
      chartInstance.value.setOption(chartOptions.value);
    }
  },
  { deep: true }
);

const handleResize = () => {
  chartInstance.value?.resize();
};

onMounted(async () => {
  await fetchLanguages(props.owner, props.repo);

  if (languages.value.length > 0) {
    initChart();
  }

  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance.value?.dispose();
});

watch(
  () => [props.owner, props.repo],
  async () => {
    await fetchLanguages(props.owner, props.repo);
    if (languages.value.length > 0) {
      initChart();
    }
  }
);
</script>

<template>
  <div
    :class="[
      cn('rounded-lg border p-4', {
        'bg-white border-divider-divider1': colorMode.preference === 'light',
        'bg-gray-800 border-gray-700': colorMode.preference === 'dark',
      }),
    ]"
  >
    <div v-if="isLoading" class="flex items-center justify-center h-[300px]">
      <Icon
        name="ph:circle-notch"
        size="32"
        class="animate-spin text-ci-primary"
      />
    </div>

    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center h-[300px]"
    >
      <Icon name="ph:warning" size="48" class="text-red-500 mb-2" />
      <p class="text-red-500 hl-14px-400">{{ error }}</p>
    </div>

    <div
      v-else-if="languages.length === 0"
      class="flex flex-col items-center justify-center h-[300px]"
    >
      <Icon name="ph:code" size="48" class="text-basic-gray-60 mb-2" />
      <p class="text-basic-gray-70 hl-14px-400">No language data available</p>
    </div>

    <div v-else ref="chartRef" class="w-full h-[300px]" />
  </div>
</template>
