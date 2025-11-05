<script setup lang="ts">
import { TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    variant?: 'primary' | 'warning' | 'danger'
    title?: string
    message?: string
    iconName?: string
    confirmButtonText?: string
    cancelButtonText?: string
    showCancelButton?: boolean
  }>(),
  {
    variant: 'primary',
    title: undefined,
    message: undefined,
    iconName: undefined,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    showCancelButton: false,
  }
)

const emit = defineEmits<{
  (e: 'cancel' | 'confirm'): void
}>()

const textColorClasses = computed(() => {
  return {
    primary: 'text-cta-primary-default',
    warning: 'text-cta-warning-default',
    danger: 'text-cta-danger-default',
  }[props.variant ?? 'primary']
})
</script>

<template>
  <TransitionRoot appear :show="open" as="template">
    <Teleport to="body">
      <div class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <div class="w-full max-w-[460px] rounded-2xl bg-white p-6">
                <header class="flex flex-row items-center">
                  <Icon
                    v-if="iconName"
                    :name="iconName"
                    size="24"
                    :class="cn('mr-2 shrink-0', textColorClasses)"
                  />
                  <h2 v-if="title" :class="cn('hl-20px-600', textColorClasses)">
                    {{ title }}
                  </h2>
                  <UiIconButton
                    icon-name="ph:x"
                    variant="ghost"
                    class="ml-auto"
                    @click="emit('cancel')"
                  />
                </header>
                <p
                  v-if="message"
                  :class="
                    cn('hl-16px-400 text-basic-gray-90 mt-3 text-left wrap-anywhere', {
                      'pl-8': !!iconName,
                    })
                  "
                >
                  {{ message }}
                </p>
                <div class="mt-8 flex flex-row justify-end gap-4">
                  <UiButton variant="secondary" @click="emit('cancel')">
                    {{ cancelButtonText }}
                  </UiButton>
                  <UiButton :variant="variant" @click="emit('confirm')">
                    {{ confirmButtonText }}
                  </UiButton>
                </div>
              </div>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Teleport>
  </TransitionRoot>
</template>
