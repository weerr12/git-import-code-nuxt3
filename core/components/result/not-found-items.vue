<script setup lang="ts">
import type { IllustrationName } from '../illustration/illustration.vue'

withDefaults(
  defineProps<{
    iconName?: IllustrationName
    message?: string
    detail?: string
  }>(),
  {
    iconName: 'fail',
    message: '',
    detail: '',
  }
)
</script>

<template>
  <div :class="cn('flex flex-col items-center justify-center py-20', $attrs.class ?? '')">
    <slot name="illustration">
      <UiIllustration :name="iconName" class="mb-6 shrink-0" />
    </slot>
    <div class="flex flex-col items-center gap-2">
      <p v-if="message" class="hl-16px-600 text-basic-gray-80">
        {{ message }}
      </p>
      <p v-if="detail" class="hl-14px-400 text-basic-gray-70 text-center whitespace-pre">
        {{ detail }}
      </p>
    </div>
  </div>
</template>
