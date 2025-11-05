<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { useTableInject } from './use-table-context'

const { variant } = useTableInject()!

const theadVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-panels-gray-2',
      headless: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
</script>

<template>
  <thead :class="cn(theadVariants({ variant }), $attrs.class ?? '')">
    <slot />
  </thead>
</template>
