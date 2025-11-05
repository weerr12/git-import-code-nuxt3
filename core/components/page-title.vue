<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>
<template>
  <section :class="$attrs.class ?? ''">
    <h2 v-if="title" class="hl-20px-600">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="hl-16px-400 text-basic-gray-80 mt-1.5">
      {{ subtitle }}
    </p>
  </section>
</template>
