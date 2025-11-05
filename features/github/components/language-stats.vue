<script setup lang="ts">
import { useRepositoryLanguages } from "~/features/github/composables/use-repository-languages";

const props = defineProps<{
  owner: string;
  repo: string;
}>();
const colorMode = useColorMode();

const { languages, isLoading, error, fetchLanguages } =
  useRepositoryLanguages();

const topLanguages = computed(() => languages.value.slice(0, 5));

onMounted(() => {
  fetchLanguages(props.owner, props.repo);
});

watch(
  () => [props.owner, props.repo],
  () => {
    fetchLanguages(props.owner, props.repo);
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
    <h3 class="hl-16px-600 mb-4">Languages</h3>

    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <Icon
        name="ph:circle-notch"
        size="24"
        class="animate-spin text-ci-primary"
      />
    </div>

    <div v-else-if="error" class="text-red-500 hl-14px-400">
      {{ error }}
    </div>

    <div v-else-if="languages.length > 0" class="gap-3 flex flex-col">
      <div v-for="lang in topLanguages" :key="lang.language" class="space-y-1">
        <div class="flex items-center justify-between hl-14px-400">
          <div class="flex items-center gap-2">
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: lang.color }"
            />
            <span>{{ lang.language }}</span>
          </div>
          <span class="text-basic-gray-70">
            {{ lang.percentage.toFixed(1) }}%
          </span>
        </div>

        <div
          :class="[
            cn('h-2 rounded-full overflow-hidden', {
              'bg-gray-200': colorMode.preference === 'light',
              'bg-gray-700': colorMode.preference === 'dark',
            }),
          ]"
        >
          <div
            class="h-full transition-all duration-300"
            :style="{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
            }"
          />
        </div>
      </div>

      <p
        v-if="languages.length > 5"
        class="text-basic-gray-70 hl-12px-400 text-center pt-2"
      >
        +{{ languages.length - 5 }} more languages
      </p>
    </div>

    <div v-else class="text-basic-gray-70 hl-14px-400 text-center py-8">
      No language data available
    </div>
  </div>
</template>
