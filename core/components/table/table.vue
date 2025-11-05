<script setup lang="ts">
import { type TableVariant, useTableProvider } from './use-table-context'
const props = withDefaults(
  defineProps<{
    variant?: TableVariant
  }>(),
  {
    variant: 'default',
  }
)

useTableProvider({
  variant: props.variant,
})
</script>

<template>
  <table
    :class="
      cn(
        'w-full border-separate border-spacing-0 overflow-hidden text-start align-top',
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </table>
</template>
