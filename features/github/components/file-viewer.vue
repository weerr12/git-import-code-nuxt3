<script setup lang="ts">
import type { FileTreeItem } from "~/features/github/types/github";

defineProps<{
  file: FileTreeItem;
  highlightedCode: string;
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const colorMode = useColorMode();
</script>

<template>
  <div
    :class="[
      cn('rounded-lg border sticky top-6 h-[calc(100vh-12rem)] flex flex-col'),
      {
        'bg-white border-divider-divider1': colorMode.preference === 'light',
        'bg-gray-800 border-gray-700': colorMode.preference === 'dark',
      },
    ]"
  >
    <div
      :class="[
        cn(
          'border-b px-6 py-4 flex items-center justify-between flex-shrink-0'
        ),
        {
          'border-divider-divider1': colorMode.preference === 'light',
          'border-gray-700': colorMode.preference === 'dark',
        },
      ]"
    >
      <div class="flex-1 min-w-0">
        <h2 class="hl-16px-600 truncate">
          {{ file.name }}
        </h2>
        <p class="hl-12px-400 text-basic-gray-60 truncate">
          {{ file.path }}
        </p>
      </div>
      <button
        @click="$emit('close')"
        class="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-panels-gray-1 transition-colors flex-shrink-0"
        aria-label="Close file viewer"
      >
        <Icon name="ph:x" size="20" />
      </button>
    </div>

    <div class="overflow-auto flex-1 bg-[#24292e]">
      <div class="relative overflow-x-auto h-full">
        <div v-html="highlightedCode" class="text-sm" />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(pre) {
  padding: 1.5rem;
  overflow-x: auto;
}

:deep(code) {
  font-family: "Courier New", Courier, monospace;
  line-height: 1.5;
}
</style>
