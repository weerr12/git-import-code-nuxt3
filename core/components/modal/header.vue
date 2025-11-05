<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: undefined,
    subtitle: undefined,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <header class="flex justify-between gap-4 px-6 pt-6">
    <UiPageTitle :title="title" :subtitle="subtitle" />
    <UiModalCloseButton @click="emit('close')" />
  </header>
</template>
