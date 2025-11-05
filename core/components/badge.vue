<script setup lang="ts">
import { cva } from 'class-variance-authority'

const badgeVariants = cva('shrink-0 whitespace-nowrap', {
  variants: {
    variant: {
      default: 'text-basic-gray-80 bg-badge-neutral-bg',
      'default-solid': 'text-white bg-badge-neutral-hover',
      success: 'text-badge-success-hover bg-badge-success-bg',
      'success-solid': 'text-white bg-badge-success-hover',
      warning: 'text-badge-warning-hover bg-badge-warning-bg',
      'warning-solid': 'text-white bg-badge-warning-hover',
      error: 'text-badge-danger-hover bg-badge-danger-bg',
      'error-solid': 'text-white bg-badge-danger-hover',
      indigo: ' text-badge-indigo-hover bg-badge-indigo-bg',
      'indigo-solid': 'text-white bg-badge-indigo-hover',
      purple: ' text-badge-purple-hover bg-badge-purple-bg',
      'purple-solid': ' text-white bg-badge-purple-hover',
      pink: ' text-badge-pink-hover bg-badge-pink-bg',
      'pink-solid': ' text-white bg-badge-pink-hover',
      disabled: ' text-basic-gray-50 bg-badge-neutral-bg',
    },
    size: {
      regular: ' font-hl text-sm py-[5px] px-3',
      sm: 'font-hl text-xs py-1 px-3',
    },
    borderRadious: {
      regular: 'rounded',
      rounded: 'rounded-2xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'regular',
  },
})

withDefaults(
  defineProps<{
    variant?: NonNullable<Parameters<typeof badgeVariants>[0]>['variant']
    size?: NonNullable<Parameters<typeof badgeVariants>[0]>['size']
    borderRadious?: NonNullable<Parameters<typeof badgeVariants>[0]>['borderRadious']
  }>(),
  {
    variant: 'default',
    size: 'regular',
    borderRadious: 'regular',
  }
)
</script>

<template>
  <span :class="cn(badgeVariants({ variant, size, borderRadious }), $attrs.class ?? '')">
    <slot />
  </span>
</template>
