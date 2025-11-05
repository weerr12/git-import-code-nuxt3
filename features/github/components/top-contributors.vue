<script setup lang="ts">
import { useContributors } from "../composables/use-contributors";

const props = defineProps<{ owner: string; repo: string }>();
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const { topContributors, isLoadingList, errorList, fetchContributors } =
  useContributors(props.owner, props.repo);

onMounted(fetchContributors);
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
      Top Contributors
    </h3>

    <div
      v-if="isLoadingList"
      class="py-8 text-center"
      :class="cn('text-gray-600', { 'text-gray-400': isDark })"
    >
      Loading...
    </div>
    <div
      v-else-if="errorList"
      class="py-8 text-center text-red-600"
      :class="{ 'text-red-400': isDark }"
    >
      {{ errorList }}
    </div>

    <div v-else>
      <div
        v-if="!topContributors.length"
        class="py-8 text-center"
        :class="cn('text-gray-600', { 'text-gray-400': isDark })"
      >
        No contributors found
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="c in topContributors"
          :key="c.login"
          class="flex flex-col gap-2"
        >
          <div>
            <img :src="c.avatar_url" alt="" class="w-8 h-8 rounded-full" />
            <a
              :href="c.html_url"
              target="_blank"
              rel="noopener"
              :class="
                cn('text-sm font-medium text-gray-900', {
                  'text-white': isDark,
                })
              "
              >{{ c.login }}</a
            >
          </div>
          <div class="flex items-center gap-3">
            <div
              class="w-40 h-2 rounded bg-gray-100 overflow-hidden"
              :class="{ 'bg-gray-800': isDark }"
            >
              <div
                class="h-full bg-green-600"
                :class="{ 'bg-green-500': isDark }"
                :style="{ width: c.percentage + '%' }"
              />
            </div>
            <div
              :class="
                cn('text-sm tabular-nums text-gray-600', {
                  'text-gray-400': isDark,
                })
              "
            >
              {{ c.contributions.toLocaleString() }} commits
            </div>
            <div
              :class="
                cn('text-sm tabular-nums text-gray-900', {
                  'text-white': isDark,
                })
              "
            >
              {{ c.percentage }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
