<script setup lang="ts">
import { useFocus } from "@vueuse/core";

// definedModel -> เพื่อให้ component นี้สามารถใช้ v-model ได้
const model = defineModel<string>({
  default: "",
});

const props = withDefaults(
  defineProps<{
    type?: "text" | "password" | "search" | "number";
    label?: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    helper?: string | null;
    error?: string | null;
    inputClass?: string;
    iconName?: string;
    iconPosition?: "left" | "right";
    iconClickable?: boolean;
    iconSize?: number;
    maxLength?: number;
    readonly?: boolean;
  }>(),
  {
    type: "text",
    label: undefined,
    required: false,
    placeholder: "",
    disabled: false,
    helper: null,
    error: null,
    inputClass: "",
    iconName: undefined,
    iconPosition: "right",
    maxLength: undefined,
    readonly: false,
    iconSize: 24,
  }
);

// event ที่ component นี้จะส่งออกไป
const emit = defineEmits<{
  (e: "iconClick" | "focus" | "blur" | "change"): void; // e ต้องเป็น string 1 ใน 4 ค่า
  (e: "change", value: string): void; // : void → ฟังก์ชัน ไม่คืนค่าอะไร
  (e: "keydown.tab", ev: KeyboardEvent): void;
}>();

const inputRef = shallowRef();
const { focused } = useFocus(inputRef);
const colorMode = useColorMode();

function focus() {
  focused.value = true;
  emit("focus");
}

function blur() {
  focused.value = true;
  emit("blur");
}

function onTabFocus(e: KeyboardEvent) {
  if (e.code !== "Tab") return;
  e.preventDefault();

  emit("keydown.tab", e);
}

// เมื่อ model มีการเปลี่ยนแปลง จะ emit event 'change' พร้อมกับค่าของ model ใหม่
watch(model, (newModel) => emit("change", newModel));
defineExpose({
  focus,
  blur,
});
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
        v-model="model"
        :type="type"
        :class="
          cn(
            'border-input-field-border-default placeholder:text-basic-gray-60 hl-16px-400 h-10 w-full rounded-lg border px-3', // base styles
            'focus:border-input-field-border-focused focus:ring-input-field-border-focused/20 focus:ring-4 focus-visible:outline-none', // Focus state
            'disabled:bg-input-field-bg-disable disabled:text-basic-gray-60',
            {
              'bg-white text-gray-900': colorMode.value === 'light',
              'bg-gray-800 text-white border-gray-700':
                colorMode.value === 'dark',
              'border-input-field-border-invalid focus:border-input-field-border-invalid':
                !!error,
              'pr-11': !!props.iconName && iconPosition === 'right',
              'pl-11': !!props.iconName && iconPosition === 'left',
            },
            inputClass
          )
        "
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        :readonly="readonly"
        @keydown="onTabFocus"
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
            :size="props.iconSize"
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
