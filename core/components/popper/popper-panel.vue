<script setup lang="ts">
import { inject } from 'vue'

const popoverState = inject<{ isOpen: Ref<boolean>; trigger: Ref<HTMLDivElement> }>('popoverState')

const position = ref({ top: 0, left: 0 })

const updatePosition = () => {
  if (popoverState?.trigger?.value) {
    const rect = popoverState?.trigger.value.getBoundingClientRect()
    position.value = {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX + 8,
    }
  }
}

onMounted(updatePosition)
watch(() => popoverState?.trigger?.value, updatePosition)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="popoverState!.isOpen.value"
      class="absolute z-50"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
    >
      <div class="relative"><slot /></div>
    </div>
  </Teleport>
</template>
