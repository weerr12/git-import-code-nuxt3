<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import numeral from 'numeral'

const model = defineModel<number | null>({
  default: null,
})

const props = withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
    helper?: string | null
    error?: string | null
    inputClass?: string
    iconName?: string
    iconPosition?: 'left' | 'right'
    iconClickable?: boolean
    precision?: number
  }>(),
  {
    label: undefined,
    required: false,
    placeholder: '',
    disabled: false,
    helper: null,
    error: null,
    inputClass: '',
    iconName: undefined,
    iconPosition: 'right',
    precision: 2,
  }
)

const emit = defineEmits<{
  (e: 'iconClick' | 'focus' | 'blur' | 'change'): void
  (e: 'change', value: number | null): void
}>()

const inputRef = shallowRef()
const { focused } = useFocus(inputRef)

const format = computed(() => {
  return `0,0[.][${Array(props.precision).fill('0').join('')}]`
})

const formattedValue = computed({
  get() {
    if (model.value === null || model.value === undefined) {
      return ''
    } else {
      return numeral(model.value).format(format.value)
    }
  },
  set(newValue) {
    model.value = newValue ? numeral(newValue).value() : 0
  },
})

function handleKeyPress($event: KeyboardEvent) {
  const key: string = $event.key
  const currentValue: string = ($event.target as HTMLInputElement).value

  const regex: RegExp = /^[0-9\b\t.]+$/

  if (!regex.test(key)) {
    $event.preventDefault()
  }

  if (key === '.' && (currentValue.includes('.') || props.precision === 0)) {
    $event.preventDefault()
  }

  const decimalIndex: number = currentValue.indexOf('.')
  if (
    decimalIndex !== -1 &&
    currentValue.substring(decimalIndex + 1).length >= props.precision &&
    key !== '\b'
  ) {
    $event.preventDefault()
  }
}

function handlePaste($event: ClipboardEvent) {
  const pastedText = $event.clipboardData?.getData('text/plain')

  if (!pastedText) {
    return
  }

  const regex = /^\d*$/
  if (!regex.test(pastedText)) {
    $event.preventDefault()
  }
}

function focus() {
  focused.value = true
  emit('focus')
}

function blur() {
  focused.value = true
  emit('blur')
}

watch(model, (newModel) => emit('change', newModel))

defineExpose({
  focus,
  blur,
})
</script>

<template>
  <div :class="cn('flex flex-col gap-1', $attrs.class ?? '')">
    <slot name="label">
      <template v-if="label">
        <UiLabel :required="required">{{ label }}</UiLabel>
      </template>
    </slot>

    <div class="relative">
      <input
        ref="inputRef"
        v-model="formattedValue"
        type="text"
        :class="
          cn(
            'border-input-field-border-default placeholder:text-basic-gray-60 hl-16px-400 h-10 w-full rounded-lg border bg-white px-3', // idel state
            'focus:border-input-field-border-focused focus:ring-input-field-border-focused/20 focus:ring-4 focus-visible:outline-none', // Focus state
            'disabled:bg-input-field-bg-disable disabled:text-basic-gray-60', // disabled state
            {
              'border-input-field-border-invalid focus:border-input-field-border-invalid': !!error,
              'pr-11': !!props.iconName && iconPosition === 'right',
              'pl-11': !!props.iconName && iconPosition === 'left',
            },
            inputClass
          )
        "
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="20"
        @keypress="handleKeyPress"
        @paste="handlePaste"
      />
      <template v-if="props.iconName">
        <div
          :class="
            cn('absolute inset-y-0 flex items-center', {
              'right-0 pr-3': iconPosition === 'right',
              'left-0 pl-3': iconPosition === 'left',
            })
          "
        >
          <Icon
            :name="props.iconName"
            size="24"
            :class="
              cn('text-basic-gray-60', {
                'text-basic-gray-50': disabled,
                'cursor-pointer': iconClickable,
              })
            "
            @click="emit('iconClick')"
          />
        </div>
      </template>
    </div>

    <slot name="helper">
      <template v-if="helper">
        <UiHelper>{{ helper }}</UiHelper>
      </template>
    </slot>

    <slot name="error">
      <template v-if="error">
        <UiHelper variant="error">{{ error }}</UiHelper>
      </template>
    </slot>
  </div>
</template>
