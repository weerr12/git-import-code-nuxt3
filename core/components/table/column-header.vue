<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { useTableInject } from './use-table-context'

const { variant } = useTableInject()!

const cellVariants = cva('text-basic-gray-80', {
  variants: {
    variant: {
      default: 'hl-14px-400 px-6 py-2 border-b border-panels-gray-2',
      headless: 'px-6 pb-2 hl-14px-600',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'default',
    align: 'left',
  },
})

withDefaults(
  defineProps<{
    align?: NonNullable<Parameters<typeof cellVariants>[0]>['align']
    width?: number | string
    minWidth?: number | string
  }>(),
  {
    align: 'left',
    width: undefined,
    minWidth: undefined,
  }
)
</script>

<template>
  <th
    :class="cn(cellVariants({ variant, align }), $attrs.class ?? '')"
    :style="{
      width: width ? `${width}px` : undefined,
      minWidth: minWidth ? `${minWidth}px` : width ? `${width}px` : undefined,
    }"
  >
    <slot />
  </th>
</template>
