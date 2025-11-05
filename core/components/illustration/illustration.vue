<script setup lang="ts">
export type IllustrationName =
  | 'no-result'
  | 'no-available'
  | 'fail'
  | 'cant-connect'
  | 'no-item'
  | 'no-preview-item'
const props = defineProps<{
  name: IllustrationName
}>()

const illustrationComponent = computed(() => {
  return props.name ? defineAsyncComponent(() => import(`../illustration/${props.name}.vue`)) : null
})
</script>
<template>
  <illustrationComponent />
</template>
