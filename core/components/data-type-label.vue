<script setup lang="ts">
import { cva } from 'class-variance-authority'

const dataTypeVariants = cva('inline-flex shrink-0 items-center border justify-center', {
  variants: {
    type: {
      [DataType.INT]: 'text-data-int-main border-data-int-main',
      [DataType.NUMERIC]: 'text-data-numeric-main border-data-numeric-main',
      [DataType.UUID]: 'text-data-uuid-main border-data-uuid-main',
      [DataType.STRING]: 'text-data-string-main border-data-string-main',
      [DataType.TEXT]: 'text-data-text-main border-data-text-main',
      [DataType.LAT_LONG]: 'text-data-lat-long-main border-data-lat-long-main',
      [DataType.BOOLEAN]: 'text-data-boolean-main border-data-boolean-main',
      [DataType.TIMESTAMP]: 'text-data-timestamp-main border-data-timestamp-main',
      [DataType.JSON]: 'text-data-json-main border-data-json-main',
      [DataType.ARRAY_INT]: 'text-data-json-main border-data-json-main',
      [DataType.ARRAY_STRING]: 'text-data-json-main border-data-json-main',
      [DataType.ARRAY]: 'text-data-json-main border-data-json-main',
      [DataType.REFERENCE]: 'text-data-reference-main border-data-reference-main',
      [DataType.OBJECT]: 'text-data-json-main border-data-json-main',
      [DataType.ARR_BOOLEAN]: 'text-data-boolean-main border-data-boolean-main',
      [DataType.ARR_NUMERIC]: 'text-data-json-main border-data-json-main',
      [DataType.ARR_UUID]: 'text-data-uuid-main border-data-uuid-main',
    },

    size: {
      regular: 'h-10 w-12 text-2xl rounded-lg',
      sm: 'h-6 w-8 text-base rounded',
    },
  },
  defaultVariants: {
    size: 'regular',
  },
})

withDefaults(
  defineProps<{
    type: string // DataType
    size?: NonNullable<Parameters<typeof dataTypeVariants>[0]>['size']
  }>(),
  {
    size: 'regular',
  }
)

const icon = {
  [DataType.INT]: 'ph:number-square-two-fill',
  [DataType.NUMERIC]: 'ph:number-square-two-fill',
  [DataType.UUID]: 'ph:key-fill',
  [DataType.STRING]: 'ph:text-aa',
  [DataType.TEXT]: 'ph:file-text-fill',
  [DataType.LAT_LONG]: 'ph:map-pin-fill',
  [DataType.BOOLEAN]: 'ph:toggle-right-fill',
  [DataType.TIMESTAMP]: 'ph:calendar-blank-fill',
  [DataType.JSON]: 'ph:code-fill',
  [DataType.ARRAY_INT]: 'ph:number-square-two-fill',
  [DataType.ARRAY_STRING]: 'ph:text-aa',
  [DataType.REFERENCE]: 'ph:link',
  [DataType.OBJECT]: 'ph:code-fill',
  [DataType.ARRAY]: 'ph:text-aa',
  [DataType.ARR_BOOLEAN]: 'ph:text-aa',
  [DataType.ARR_NUMERIC]: 'ph:number-square-two-fill',
  [DataType.ARR_UUID]: 'ph:key-fill',
}
</script>

<template>
  <div :class="cn(dataTypeVariants({ type: type as DataType, size }), $attrs.class ?? '')">
    <Icon :name="icon[type as DataType]" />
  </div>
</template>
