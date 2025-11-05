<script setup lang="ts">
import { Switch } from '@headlessui/vue'

const model = defineModel<boolean>({
  default: false,
})

withDefaults(
  defineProps<{
    label?: string
    helper?: string | null
    error?: string | null
    disabled?: boolean
    defaultChecked?: boolean
  }>(),
  {
    label: undefined,
    helper: null,
    error: null,
    disabled: false,
    defaultChecked: false,
  }
)
</script>

<template>
  <div :class="cn('flex flex-col gap-1', $attrs.class ?? '')">
    <slot name="label">
      <template v-if="label">
        <UiLabel>{{ label }}</UiLabel>
      </template>
    </slot>

    <Switch
      v-model="model"
      v-slot="{ checked }"
      :default-checked="defaultChecked"
      :disabled="disabled"
    >
      <div
        :class="
          cn('relative inline-flex h-6 w-11 items-center rounded-full', [
            model ? 'bg-ci-primary' : 'bg-basic-gray-60',
            {
              'opacity-40': disabled,
            },
          ])
        "
      >
        <span
          :class="model ? 'translate-x-6' : 'translate-x-1'"
          class="inline-block h-4 w-4 transform rounded-full bg-white transition"
        />
      </div>
      <label class="text-hl-14px-400 ml-4">{{ checked ? 'On' : 'Off' }}</label>
    </Switch>

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
