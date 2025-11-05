<script setup lang="ts">
const model = defineModel<boolean>({
  default: false,
})

defineProps<{
  indeterminate?: boolean
  label?: string
  disabled?: boolean
}>()

function handleClick() {
  model.value = !model.value
  emit('change', model.value)
}

const emit = defineEmits(['change'])
</script>

<template>
  <div
    :class="
      cn('group inline-flex shrink-0 cursor-pointer items-start gap-2', {
        'pointer-events-none': disabled,
      })
    "
    @click="handleClick"
  >
    <div
      :class="
        cn(
          'border-basic-gray-60 group-hover:ring-feedback/[0.06] relative top-[3px] size-5 rounded border-2 group-hover:ring-4',
          {
            'bg-ci-primary border-0': model,
            'border-basic-gray-40': disabled,
            'bg-basic-gray-40': disabled && model,
          }
        )
      "
    >
      <template v-if="model && indeterminate">
        <svg
          width="16"
          height="4"
          viewBox="0 0 16 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.4995 3.5L1.49951 3.5C0.671084 3.5 -0.000488485 2.82843 -0.000488412 2C-0.00048834 1.17157 0.671085 0.5 1.49951 0.5L14.4995 0.500001C15.3279 0.500001 15.9995 1.17157 15.9995 2C15.9995 2.82843 15.3279 3.5 14.4995 3.5Z"
            fill="white"
          />
        </svg>
      </template>
      <template v-else-if="model">
        <svg
          width="14"
          height="11"
          viewBox="0 0 14 11"
          fill="none"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.45711 9.95711C5.06658 10.3476 4.43342 10.3476 4.04289 9.95711L0.292893 6.20711C-0.0976311 5.81658 -0.0976311 5.18342 0.292893 4.79289C0.683417 4.40237 1.31658 4.40237 1.70711 4.79289L4.75 7.83579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
            fill="white"
          />
        </svg>
      </template>
    </div>

    <slot name="label">
      <template v-if="label">
        <span
          :class="
            cn('hl-16px-400 flex-1 basis-1 truncate', {
              'text-basic-gray-60': disabled,
            })
          "
        >
          {{ label }}
        </span>
      </template>
    </slot>
  </div>
</template>
