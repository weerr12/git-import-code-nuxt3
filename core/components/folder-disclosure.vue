<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

defineProps<{
  name: string
}>()

function beforeEnter(el: Element) {
  if (!(el instanceof HTMLElement)) return
  el.style.height = '0'
  el.style.overflow = 'hidden'
}

function enter(el: Element) {
  if (!(el instanceof HTMLElement)) return
  el.style.height = 'auto'
  const height = el.scrollHeight + 'px'
  el.style.height = '0'
  requestAnimationFrame(() => {
    el.style.height = height
  })
}

function afterEnter(el: Element) {
  if (!(el instanceof HTMLElement)) return
  el.style.height = 'auto'
  el.style.overflow = 'visible'
}

function beforeLeave(el: Element) {
  if (!(el instanceof HTMLElement)) return
  el.style.height = el.scrollHeight + 'px'
  el.style.overflow = 'hidden'
}

function leave(el: Element) {
  if (!(el instanceof HTMLElement)) return
  requestAnimationFrame(() => {
    el.style.height = '0'
  })
}

function afterLeave(el: Element) {
  if (!(el instanceof HTMLElement)) return
  el.style.height = 'auto'
  el.style.overflow = 'visible'
}
</script>

<template>
  <div>
    <Disclosure v-slot="{ open }" :default-open="true">
      <DisclosureButton class="flex w-full cursor-pointer flex-row items-center gap-2">
        <Icon
          name="ph:caret-down"
          size="16"
          :class="
            cn('text-basic-gray-80 shrink-0 transform transition-all', {
              'rotate-180': open,
            })
          "
        />

        <span class="hl-14px-400 text-basic-gray-80">{{ name }}</span>
      </DisclosureButton>
      <transition
        class="transition-all duration-200 ease-in-out"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <DisclosurePanel>
          <div class="flex flex-col gap-1 pt-1">
            <slot />
          </div>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>
