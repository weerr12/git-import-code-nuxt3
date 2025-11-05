<script setup lang="ts">
import { cva } from 'class-variance-authority'

const helperVariants = cva('hl-14px-400', {
  variants: {
    variant: {
      default: 'text-basic-gray-70',
      error: 'text-input-field-border-invalid',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

withDefaults(
  defineProps<{
    variant?: NonNullable<Parameters<typeof helperVariants>[0]>['variant']
  }>(),
  {
    variant: 'default',
  }
)
</script>

<template>
  <span
  class="thisis default classes"
    :class="{
      'some calses': true,
    }"
  >
    <slot />
  </span>
</template>
