<script setup lang="ts">
import type { FileTreeItem } from "~/features/github/types/github";
import FileTreeItems from "./file-tree-item.vue";

defineProps<{
  items: FileTreeItem[];
  loading: boolean;
  error: string | null;
  selectedFile: FileTreeItem | null;
}>();

defineEmits<{
  (e: "item-click", item: FileTreeItem): void;
}>();

const colorMode = useColorMode();
</script>

<template>
  <div
    :class="[
      cn('rounded-lg border'),
      {
        'border-divider-divider1': colorMode.preference === 'light',
        'border-gray-700': colorMode.preference === 'dark',
      },
    ]"
  >
    <div
      :class="[
        cn('border-b px-6 py-4 flex items-center justify-between'),
        {
          'bg-panels-white border-input-field-border-default text-gray-900':
            colorMode.preference === 'light',
          'bg-gray-800 text-white border-gray-700':
            colorMode.preference === 'dark',
        },
      ]"
    >
      <h2 class="hl-20px-600">Project Structure</h2>
      <p class="hl-12px-400 text-basic-gray-60">
        Click folders to expand, files to view
      </p>
    </div>

    <div class="px-6 py-4 overflow-y-auto">
      <div class="flex flex-col gap-1">
        <FileTreeItems
          v-for="item in items"
          :key="item.sha"
          :item="item"
          :depth="0"
          :selected-file="selectedFile"
          @item-click="$emit('item-click', $event)"
        />
      </div>
    </div>
  </div>
</template>
