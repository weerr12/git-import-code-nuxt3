<script setup lang="ts">
import { cva } from 'class-variance-authority'

const toastItemVariants = cva('flex w-[300px] shadow-lg flex-row gap-3 p-4 rounded-lg', {
  variants: {
    variant: {
      default: 'bg-badge-neutral-bg text-badge-neutral-hover',
      info: 'bg-badge-info-bg text-badge-info-hover',
      success: 'bg-badge-success-bg text-badge-success-hover',
      warning: 'bg-badge-warning-bg text-badge-warning-hover',
      danger: 'bg-badge-danger-bg text-badge-danger-hover',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const props = withDefaults(
  defineProps<{
    variant?: NonNullable<Parameters<typeof toastItemVariants>[0]>['variant']
    title?: string
    message?: string
    duration?: number
  }>(),
  {
    variant: 'default',
    title: undefined,
    message: undefined,
    duration: undefined,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const icon = {
  default: 'ph:question',
  info: 'ph:info',
  success: 'ph:check-circle',
  warning: 'ph:warning',
  danger: 'ph:x-circle',
}

const timeoutId = ref<number | null>(null)

function onClose() {
  if (timeoutId.value !== null) {
    clearTimeout(timeoutId.value)
    timeoutId.value = null
  }

  emit('close')
}

onMounted(() => {
  if (props.duration !== undefined) {
    timeoutId.value = window.setTimeout(() => emit('close'), props.duration)
  }
})
</script>

<template>
  <div :class="cn(toastItemVariants({ variant }), $attrs.class ?? '')">
    <Icon :name="icon[variant ?? 'default']" size="24" class="shrink-0" />
    <div class="flex-1">
      <h3 class="hl-16px-600">{{ title }}</h3>
      <p v-if="message" class="text-basic-gray-80 hl-14px-400 mt-1 wrap-anywhere">
        {{ message }}
      </p>
    </div>
    <button
      class="text-basic-gray-80 hover:text-basic-gray-70 active:text-basic-gray-90 inline-flex cursor-pointer items-center justify-center self-start"
      @click="onClose"
    >
      <Icon name="ph:x" size="20" class="shrink-0" />
    </button>
  </div>
</template>
