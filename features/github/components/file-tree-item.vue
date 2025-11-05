<script setup lang="ts">
import type { TreeItem } from "~/features/github/types/github";

const props = defineProps<{
  item: TreeItem;
  depth: number;
  selectedFile: TreeItem | null;
}>();

const emit = defineEmits<{
  (e: "item-click", item: TreeItem): void;
}>();

const isSelected = computed(() => {
  return props.selectedFile?.path === props.item.path;
});
</script>

<template>
  <div>
    <button
      @click="emit('item-click', item)"
      :class="[
        cn(
          'w-full flex items-center gap-2 rounded-md px-3 py-2 hover:bg-panels-gray-1'
        ),
        {
          'bg-ci-primary/10 hover:bg-ci-primary/15': isSelected,
        },
      ]"
    >
      <Icon
        v-if="item.type === 'dir' && item.loading"
        name="ph:circle-notch"
        size="16"
        class="text-basic-gray-60 animate-spin shrink-0"
      />
      <Icon
        v-else-if="item.type === 'dir'"
        :name="item.expanded ? 'ph:folder-open' : 'ph:folder'"
        size="16"
        class="text-basic-gray-60 shrink-0"
      />
      <Icon
        v-else
        name="ph:file-code"
        size="16"
        class="text-basic-gray-60 shrink-0"
      />

      <span
        :class="[
          cn('hl-14px-400 flex-1 text-left truncate text-gray-500', {
            'ml-[calc(depth*16px)]': depth > 0,
          }),
          {
            'text-ci-primary': isSelected,
          },
        ]"
      >
        {{ item.name }}
      </span>

      <Icon
        v-if="item.type === 'dir'"
        :name="item.expanded ? 'ph:caret-down' : 'ph:caret-right'"
        size="12"
        class="text-basic-gray-60 shrink-0"
      />
    </button>

    <div v-if="item.expanded && item.children && item.children.length > 0">
      <FileTreeItem
        v-for="child in item.children"
        :key="child.sha"
        :item="child"
        :depth="depth + 1"
        :selected-file="selectedFile"
        @item-click="emit('item-click', $event)"
      />
    </div>
  </div>
</template>
