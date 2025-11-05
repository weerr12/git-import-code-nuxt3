<script setup lang="ts">
const model = defineModel<string | number>()

const { replace = false, ...props } = defineProps<{
  tabs: {
    key?: string | number
    name: string | number
    path?: string
  }[]
  replace?: boolean
}>()

const barLeft = ref(0)
const barWidth = ref(0)

const updateBarPosition = async () => {
  if (!document) return

  await nextTick()

  const el = document.getElementById(`page-tab-${model.value}`)
  if (!el || !(el instanceof HTMLElement)) return

  barWidth.value = el.offsetWidth

  const parent = el.offsetParent as HTMLElement | null
  if (parent) {
    barLeft.value = el.offsetLeft
  }
}

function onTabChange(tab: { key?: string | number; name: string | number; path?: string }) {
  if (tab.path) {
    navigateTo(tab.path, {
      replace,
    })
  } else {
    model.value = tab.key
  }
}
// Update bar on model change or tab list change
watch(() => model.value, updateBarPosition, { immediate: true })
watch(() => props.tabs, updateBarPosition)

onMounted(() => {
  updateBarPosition()
  window.addEventListener('resize', updateBarPosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateBarPosition)
})
</script>

<template>
  <div class="border-divider-divider1 relative flex flex-row gap-8 border-b">
    <button
      v-for="tab in tabs"
      :id="`page-tab-${tab.key}`"
      :key="tab.key"
      class="relative inline-block cursor-pointer py-4"
      @click="onTabChange(tab)"
    >
      <!-- Width reservation span -->
      <span class="hl-16px-600 pointer-events-none invisible absolute">
        {{ tab.name }}
      </span>

      <!-- Actual tab text -->
      <span
        :class="[
          'transition-all',
          tab.key === model ? 'hl-16px-600 pointer-events-none' : 'hl-16px-400 text-basic-gray-70',
        ]"
      >
        {{ tab.name }}
      </span>
    </button>

    <!-- Animated underline -->
    <div
      class="bg-ci-primary absolute bottom-0 h-[2px] transition-all duration-300"
      :style="{ left: `${barLeft}px`, width: `${barWidth}px` }"
    />
  </div>
</template>
