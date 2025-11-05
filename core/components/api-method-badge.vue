<script setup lang="ts">
import { cva } from 'class-variance-authority'

defineProps<{
  method?: NonNullable<Parameters<typeof badgeVariants>[0]>['method']
  size?: NonNullable<Parameters<typeof badgeVariants>[0]>['size']
}>()

const badgeVariants = cva('flex items-center justify-center rounded-md', {
  variants: {
    method: {
      GET: 'bg-api-method-get',
      POST: 'bg-api-method-post',
      PUT: 'bg-api-method-put',
      PATCH: 'bg-api-method-patch',
      DELETE: 'bg-api-method-delete',
    },
    size: {
      regular: 'h-7.5 rounded-md hl-14-400 p-2',
      sm: 'h-6 rounded px-2 hl-12-400',
    },
  },
  defaultVariants: {
    method: 'GET',
    size: 'regular',
  },
})
</script>

<template>
  <div :class="cn(badgeVariants({ method, size }), $attrs.class ?? '')">
    <span class="text-white">{{ method }}</span>
  </div>
</template>
