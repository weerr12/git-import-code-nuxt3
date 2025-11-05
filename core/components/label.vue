<script setup lang="ts">
defineProps<{
  required?: boolean
}>()
</script>
<template>
  <label :class="cn('hl-14px-400', $attrs.class ?? '')">
    <slot />
    <span v-if="required" class="text-cta-danger-default">*</span>
  </label>
</template>
