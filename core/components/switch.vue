<script setup lang="ts">
const model = defineModel<boolean>({
  default: false,
})

withDefaults(
  defineProps<{
    label?: string
    helper?: string | null
    error?: string | null
  }>(),
  {
    label: undefined,
    helper: null,
    error: null,
  }
)

function handleClick(value: boolean) {
  model.value = value
  emit('change', model.value)
}

const emit = defineEmits(['change'])
</script>

<template>
  <div :class="cn('flex flex-col gap-1', $attrs.class ?? '')">
    <slot name="label">
      <template v-if="label">
        <UiLabel>{{ label }}</UiLabel>
      </template>
    </slot>

    <div class="bg-panels-gray-1 relative isolate flex h-10 w-[185px] items-center rounded-lg">
      <div class="grid w-full grid-cols-2">
        <button
          :class="
            cn(
              'hover:hl-14px-600 hover:text-basic-gray-70 active:text-basic-gray-90 z-20 flex cursor-pointer items-center justify-center transition-all',
              {
                'text-ci-primary hl-14px-600 pointer-events-none': model === false,
                'text-basic-gray-80 hl-14px-400': model === true,
              }
            )
          "
          @click="handleClick(false)"
        >
          <slot name="false">No</slot>
        </button>
        <button
          :class="
            cn(
              'hover:hl-14px-600 hover:text-basic-gray-70 active:text-basic-gray-90 z-20 flex cursor-pointer items-center justify-center transition-all',
              {
                'text-ci-primary hl-14px-600 pointer-events-none': model === true,
                'text-basic-gray-80 hl-14px-400': model === false,
              }
            )
          "
          @click="handleClick(true)"
        >
          <slot name="true">Yes</slot>
        </button>
      </div>
      <div
        :class="
          cn('absolute z-10 h-8 w-[86.5px] rounded-lg bg-white transition-all ease-out', {
            'left-1': model === false,
            'left-[94.5px]': model === true,
          })
        "
      />
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
