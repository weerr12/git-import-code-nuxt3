<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import type { SelectOption } from '@/core/types'

const model = defineModel<string | number | undefined>({
  default: undefined,
})

const props = withDefaults(
  defineProps<{
    options: SelectOption[]
    label?: string
    required?: boolean
    helper?: string | null
    error?: string | null
    disabled?: boolean
    placeholder?: string
    loading?: boolean
    clearable?: boolean
  }>(),
  {
    label: undefined,
    required: false,
    placeholder: '',
    helper: null,
    error: null,
    clearable: true,
  }
)

const buttonRef = ref<HTMLButtonElement | null>(null)
const query = ref('')

const selected = computed(() => {
  return props.options.find((e) => e.value === model.value)
})

const filteredOptions = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter((item) =>
        item.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)

function clearSelected() {
  if (!model.value) return
  model.value = ''
  query.value = ''
}
</script>

<template>
  <div :class="cn('flex flex-col gap-1', $attrs.class ?? '')">
    <slot name="label">
      <template v-if="label">
        <UiLabel :required="required">{{ label }}</UiLabel>
      </template>
    </slot>

    <Combobox
      v-slot="{ open }"
      :model-value="selected"
      :disabled="disabled"
      @update:model-value="model = ($event as SelectOption).value"
    >
      <div class="relative">
        <ComboboxInput
          :class="
            cn(
              'hl-16px-400 border-input-field-border-default placeholder:text-basic-gray-60 h-10 w-full rounded-lg border pr-11 pl-3',
              'focus:border-input-field-border-focused focus:ring-input-field-border-focused/20 focus:ring-4 focus-visible:outline-none', // Focus state
              'disabled:bg-input-field-bg-disable disabled:text-basic-gray-60', // disabled state
              {
                'border-input-field-border-invalid focus:border-input-field-border-invalid':
                  !!error,
                'pr-16': !!model && clearable,
              }
            )
          "
          :placeholder="placeholder"
          :display-value="(item: any) => (model ? item.name : '')"
          @focus="!open ? (buttonRef as any)?.$el.click() : null"
          @change="query = $event.target.value"
        />
        <div class="absolute inset-y-0 right-11 flex items-center">
          <button v-if="selected && !disabled && clearable" type="button" @click="clearSelected">
            <Icon name="ph:x-circle-fill" size="16" class="text-basic-gray-60 cursor-pointer" />
          </button>
        </div>
        <ComboboxButton ref="buttonRef" class="absolute inset-y-0 right-0 flex items-center pr-3">
          <Icon name="ph:caret-down" size="24" class="text-basic-gray-60" />
        </ComboboxButton>

        <TransitionRoot
          leave="transition ease-in duration-100"
          leave-from="opacity-100"
          leave-to="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute z-20 mt-1 flex max-h-64 max-w-full min-w-full flex-col gap-2 overflow-auto rounded bg-white p-2 shadow-lg focus:outline-none"
          >
            <div
              v-if="filteredOptions.length === 0 && query !== ''"
              class="hl-16px-400 text-basic-gray-80 flex h-10 items-center truncate rounded px-3 py-2 text-left"
            >
              Not found
            </div>
            <div
              v-if="filteredOptions.length === 0 && query === ''"
              class="hl-16px-400 text-basic-gray-80 flex h-10 items-center truncate rounded px-3 py-2 text-left"
            >
              No data available
            </div>

            <div
              v-if="loading"
              class="hl-14px-400 text-basic-gray-80 flex h-10 items-center gap-2 truncate rounded px-3 py-2 text-left"
            >
              <Icon name="ph:circle-notch" size="20" class="shrink-0 animate-spin" />
              <span class="truncate">Downloading...</span>
            </div>

            <ComboboxOption
              v-for="(option, index) in filteredOptions"
              :key="index"
              as="template"
              :value="option"
              :disabled="option.disabled"
            >
              <li
                :title="option.name"
                :class="
                  cn(
                    'hl-16px-400 hover:bg-feedback/[0.06] active:bg-feedback/[0.16] flex h-10 shrink-0 cursor-pointer items-center truncate rounded px-3 py-2 text-left',
                    {
                      'text-ci-primary hover:text-ci-primary': model === option.value,
                      'bg-basic-gray-20 text-basic-gray-50 pointer-events-none cursor-not-allowed':
                        option.disabled,
                    }
                  )
                "
              >
                <span class="block truncate">
                  {{ option.name }}
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>

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
