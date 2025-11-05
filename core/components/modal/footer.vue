<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    loading?: boolean
    loadingText?: string
    showSecondaryButton?: boolean
    showTextLink?: boolean
    primaryButtonText?: string
    primaryButtonVariant?: 'primary' | 'danger'
    secondaryButtonText?: string
    textLinkText?: string
  }>(),
  {
    disabled: false,
    primaryButtonText: 'บันทึก',
    primaryButtonVariant: 'primary',
    secondaryButtonText: 'ยกเลิก',
    textLinkText: 'Link',
    loadingText: undefined,
  }
)

const emit = defineEmits<{
  (e: 'primary' | 'secondary' | 'link'): void
}>()
</script>

<template>
  <footer :class="cn('flex flex-col gap-4 p-6 sm:flex-row', $attrs.class ?? '')">
    <slot>
      <UiTextLink
        v-if="showTextLink"
        type="button"
        variant="secondary"
        class="order-2 sm:order-1"
        @click="emit('link')"
      >
        {{ textLinkText }}
      </UiTextLink>
      <div class="order-1 flex flex-col gap-4 sm:order-2 sm:ml-auto sm:flex-row">
        <UiButton
          v-if="showSecondaryButton"
          type="button"
          variant="secondary"
          class="order-2 sm:order-1"
          @click="emit('secondary')"
        >
          {{ secondaryButtonText }}
        </UiButton>
        <UiButton
          class="order-1 sm:order-2"
          type="button"
          :loading="loading"
          :loading-text="loadingText"
          :variant="primaryButtonVariant"
          :disabled="disabled"
          @click="emit('primary')"
        >
          {{ primaryButtonText }}
        </UiButton>
      </div>
    </slot>
  </footer>
</template>
