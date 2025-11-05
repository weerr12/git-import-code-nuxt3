<script setup lang="ts">
import { formatNumber } from '@/core/utils/index'

const props = withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
    helper?: string | null
    error?: string | null
    rows?: number
    maxlength?: number
    resizable?: boolean
    inputClass?: string
  }>(),
  {
    label: undefined,
    required: false,
    placeholder: '',
    disabled: false,
    helper: null,
    error: null,
    rows: 3,
    maxlength: 0,
    resizable: false,
    inputClass: '',
  }
)

const model = defineModel<string>()

const currentLength = computed(() => {
  return model.value?.length || 0
})

const isMaxLength = computed(() => {
  return props.maxlength > 0
})
</script>

<template>
  <div :class="cn('flex w-full flex-col gap-1', $attrs.class ?? '')">
    <template v-if="label">
      <UiLabel :required="required">{{ label }}</UiLabel>
    </template>
    <div class="relative">
      <textarea
        v-model="model"
        :class="
          cn(
            'border-input-field-border-default placeholder:text-basic-gray-60 hl-16px-400 h-[120px] w-full rounded-lg border bg-white px-3 py-2', // idel state
            'focus:border-input-field-border-focused focus:ring-input-field-border-focused/20 focus:ring-4 focus-visible:outline-none', // Focus state
            'disabled:bg-input-field-bg-disable disabled:text-basic-gray-60', // disabled state
            {
              'border-input-field-border-invalid focus:border-input-field-border-invalid': !!error,
            },
            inputClass
          )
        "
        :rows="rows"
        :disabled="disabled"
        :maxlength="isMaxLength ? maxlength : undefined"
        :placeholder="placeholder"
      />

      <template v-if="isMaxLength">
        <span class="hl-14px-400 text-basic-gray-70 absolute -bottom-5 left-0">
          Maximum: {{ formatNumber(currentLength) }} / {{ formatNumber(maxlength) }}
        </span>
      </template>

      <template v-if="helper">
        <UiHelper>{{ helper }}</UiHelper>
      </template>

      <template v-if="error">
        <UiHelper variant="error">{{ error }}</UiHelper>
      </template>
    </div>
  </div>
</template>
