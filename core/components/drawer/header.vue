<script setup lang="ts">
import { useDrawerInject } from './use-drawer-context'

defineProps<{
  title?: string
}>()

const { closeDrawer } = useDrawerInject()!
</script>
<template>
  <header class="flex flex-row items-center gap-2 px-4 pt-4 pb-8 md:px-6 md:pt-6">
    <slot name="title">
      <h2 v-if="title" class="hl-20px-600">
        {{ title }}
      </h2>
    </slot>

    <UiIconButton icon-name="ph:x" variant="ghost" class="ml-auto" @click="closeDrawer" />
  </header>
</template>
