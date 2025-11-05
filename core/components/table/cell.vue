<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { useTableInject } from './use-table-context'

const { variant } = useTableInject()!

const cellVariants = cva('hl-14px-400 px-6 py-4 border-b border-panels-gray-2 ', {
  variants: {
    variant: {
      default: '',
      headless: 'bg-white first:border-l last:border-r',
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
  }>(),
  {
    align: 'left',
  }
)
</script>

<template>
  <td :class="cn(cellVariants({ variant, align }), $attrs.class ?? '')">
    <slot />
  </td>
</template>
