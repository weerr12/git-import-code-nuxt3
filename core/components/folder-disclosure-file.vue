<script setup lang="ts">
defineProps<{
  name: string
  value: string
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', value: string): void
}>()
</script>

<template>
  <div
    :class="
      cn(
        'hover:bg-panels-gray-1 flex h-9 cursor-pointer flex-row items-center gap-1 rounded-lg pl-6',
        {
          'bg-panels-gray-1 text-ci-primary': active,
        }
      )
    "
    @click="emit('click', value)"
  >
    <Icon name="ph:article" size="16" class="shrink-0" />
    <span :class="cn('hl-14px-400 truncate')">
      {{ name }}
    </span>
  </div>
</template>
