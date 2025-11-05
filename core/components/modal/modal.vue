<script setup lang="ts">
import { TransitionRoot, TransitionChild } from "@headlessui/vue";

withDefaults(
  defineProps<{
    open: boolean;
    size?: "default" | "large";
    maxWidth?: number;
  }>(),
  {
    open: false,
    size: "default",
    maxWidth: undefined,
  }
);

const emit = defineEmits<{
  (e: "afterLeave"): void;
}>();

function onDrawerClosed() {
  emit("afterLeave");
}
</script>

<template>
  <TransitionRoot
    appear
    :show="open"
    as="template"
    @after-leave="onDrawerClosed"
  >
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
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <div
                class="w-full rounded-2xl bg-white shadow-xl transition-all"
                :style="{
                  maxWidth: maxWidth
                    ? `${maxWidth}px`
                    : size === 'default'
                    ? '560px'
                    : '946px',
                }"
              >
                <slot />
              </div>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Teleport>
  </TransitionRoot>
</template>
