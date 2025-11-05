<script setup lang="ts">
import { useCommitActivity } from "../composables/use-commit-activity";

const props = defineProps<{
  owner: string;
  repo: string;
}>();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const { heatmapData, stats, isLoading, error, fetchCommitActivity } =
  useCommitActivity(props.owner, props.repo);

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Month labels - แสดงเฉพาะเดือนที่มีพื้นที่เพียงพอ
const months = computed(() => {
  if (!heatmapData.value.length) return [];

  const monthLabels: { label: string; weekIndex: number }[] = [];
  let currentMonth = -1;

  heatmapData.value.forEach((day) => {
    const month = day.date.getMonth();
    if (month !== currentMonth && day.dayIndex === 0) {
      const isFirstWeekOfMonth = day.date.getDate() <= 7;
      if (isFirstWeekOfMonth) {
        currentMonth = month;
        monthLabels.push({
          label: day.date.toLocaleDateString("en-US", { month: "short" }),
          weekIndex: day.weekIndex,
        });
      }
    }
  });

  return monthLabels;
});

const weeks = computed(() => {
  if (!heatmapData.value.length) return [];

  const weekMap = new Map<number, typeof heatmapData.value>();

  heatmapData.value.forEach((day) => {
    if (!weekMap.has(day.weekIndex)) {
      weekMap.set(day.weekIndex, []);
    }
    weekMap.get(day.weekIndex)!.push(day);
  });

  return Array.from(weekMap.values());
});

const getCellColor = (count: number) => {
  if (count === 0) {
    return isDark.value ? "bg-gray-800" : "bg-gray-100";
  }

  const max = stats.value.maxCommitsInDay;
  const intensity = count / max;

  if (isDark.value) {
    if (intensity < 0.25) return "bg-green-900/40";
    if (intensity < 0.5) return "bg-green-700/60";
    if (intensity < 0.75) return "bg-green-600/80";
    return "bg-green-500";
  } else {
    if (intensity < 0.25) return "bg-green-200";
    if (intensity < 0.5) return "bg-green-300";
    if (intensity < 0.75) return "bg-green-500";
    return "bg-green-600";
  }
};

const getTooltipContent = (day: (typeof heatmapData.value)[0]) => {
  const dateStr = day.date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${day.count} commits on ${dateStr}`;
};

onMounted(() => {
  fetchCommitActivity();
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
    <div class="flex items-center justify-between mb-4">
      <h3
        :class="
          cn('text-lg font-semibold text-gray-900', {
            'text-white': isDark,
          })
        "
      >
        Commit Frequency
      </h3>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div
        :class="
          cn('animate-spin rounded-full h-8 w-8 border-b-2 border-green-600', {
            'border-green-400': isDark,
          })
        "
      />
    </div>

    <div
      v-else-if="error"
      :class="
        cn('p-4 rounded-lg text-sm bg-red-50 text-red-600', {
          'bg-red-900/20 text-red-400': isDark,
        })
      "
    >
      {{ error }}
    </div>

    <div v-else-if="weeks.length" class="overflow-x-auto">
      <div class="inline-flex flex-col gap-1 min-w-max">
        <div class="flex gap-0 mb-2 ml-8 text-xs">
          <div
            v-for="(month, index) in months"
            :key="month.weekIndex"
            :style="{
              marginLeft:
                index === 0
                  ? '0'
                  : `${
                      (month.weekIndex - (months[index - 1]?.weekIndex || 0)) *
                      14
                    }px`,
            }"
            :class="
              cn('text-gray-600 max-w-[56px] truncate', {
                'text-gray-400': isDark,
              })
            "
          >
            {{ month.label }}
          </div>
        </div>

        <div class="flex gap-1 ">
          <div
            :class="
              cn('flex flex-col gap-1 text-xs pr-2 text-gray-600', {
                'text-gray-400': isDark,
              })
            "
          >
            <div
              v-for="(day, index) in daysOfWeek"
              :key="day"
              class="h-3 flex items-center"
            >
              <span v-if="index % 2 === 1">{{ day }}</span>
            </div>
          </div>

          <div class="flex gap-1">
            <div
              v-for="(week, weekIndex) in weeks"
              :key="weekIndex"
              class="flex flex-col gap-1"
            >
              <div
                v-for="day in week"
                :key="`${day.weekIndex}-${day.dayIndex}`"
                :content="getTooltipContent(day)"
                placement="top"
              >
                <div
                  :class="
                    cn(
                      'w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-green-600',
                      {
                        'hover:ring-green-400': isDark,
                      },
                      getCellColor(day.count)
                    )
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <div
          :class="
            cn('flex items-center gap-2 mt-4 text-xs text-gray-600', {
              'text-gray-400': isDark,
            })
          "
        >
          <span>Less</span>
          <div class="flex gap-1">
            <div
              :class="
                cn('w-3 h-3 rounded-sm bg-gray-100', {
                  'bg-gray-800': isDark,
                })
              "
            />
            <div
              :class="
                cn('w-3 h-3 rounded-sm bg-green-200', {
                  'bg-green-900/40': isDark,
                })
              "
            />
            <div
              :class="
                cn('w-3 h-3 rounded-sm bg-green-300', {
                  'bg-green-700/60': isDark,
                })
              "
            />
            <div
              :class="
                cn('w-3 h-3 rounded-sm bg-green-500', {
                  'bg-green-600/80': isDark,
                })
              "
            />
            <div
              :class="
                cn('w-3 h-3 rounded-sm bg-green-600', {
                  'bg-green-500': isDark,
                })
              "
            />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>

    <div
      v-else
      :class="
        cn('text-center py-12 text-sm text-gray-600', {
          'text-gray-400': isDark,
        })
      "
    >
      No commit activity data available
    </div>
  </div>
</template>
