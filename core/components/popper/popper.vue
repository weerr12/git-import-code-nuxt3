<script setup lang="ts">
const isOpen = ref(false)
const trigger = ref(null)

import { useTimeoutFn } from '@vueuse/core'

const { isPending, start, stop } = useTimeoutFn(
  (ctx) => {
    isOpen.value = true
  },
  1500,
  { immediate: false }
)

const open = () => {
  start()
}
const close = () => {
  isOpen.value = false
  stop()
}

provide('popoverState', {
  isOpen,
  open,
  close,
  trigger,
})
</script>
<template>
  <div ref="trigger" @mouseenter="open" @mouseleave="close" class="relative inline-block w-full">
    <slot />
  </div>
</template>
