<script setup lang="ts">
import { TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useDrawerProvider } from './use-drawer-context'

withDefaults(
  defineProps<{
    open: boolean
    size?: 'default' | 'large'
    position?: 'left' | 'right'
    maxWidth?: number
  }>(),
  {
    size: 'default',
    maxWidth: undefined,
    position: 'right',
  }
)
/**
 * emit event ที่ component นี้จะส่งออกไป
 * e ต้องเป็น string 1 ใน 3 ค่า
 * 'close' → ปิด drawer
 * 'afterLeave' → drawer ปิด animation เสร็จ
 * 'afterEnter' → drawer เปิด animation เสร็จ
 */
const emit = defineEmits<{
  (e: 'close' | 'afterLeave' | 'afterEnter'): void
}>()

function closeDrawer() {
  emit('close')
}

function onDrawerClosed() {
  emit('afterLeave')
}
function onDrawerOpened() {
  emit('afterEnter')
}

/**
 * ส่ง Provider ให้ component ลูก
 * closeDrawer() → ฟังก์ชันปิด drawer
 */
useDrawerProvider({
  closeDrawer,
})
</script>

<template>
  <TransitionRoot appear :show="open" as="template" @after-leave="onDrawerClosed">
    <Teleport to="body">
      <div class="relative z-50">
        <!-- /**
          * ส่วนที่สร้าง overlay ด้านหลัง drawer
          * TransitionChild คือการกำหนด animation ให้กับ overlay
          * @before-enter="onDrawerOpened" → เมื่อเริ่มเปิด drawer จะเรียกใช้ฟังก์ชัน onDrawerOpened
          * มี blackdrop สีดำทึบแสง 25% (bg-black/25)
          *
         */ -->
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
          @before-enter="onDrawerOpened"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div
          :class="
            cn('fixed top-0 flex h-screen w-full', {
              'justify-start': position === 'left',
              'justify-end': position === 'right',
            })
          "
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            :enter-from="
              cn('opacity-0 ', {
                '-translate-x-10': position === 'left',
                'translate-x-10': position === 'right',
              })
            "
            enter-to="opacity-100 translate-x-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 translate-x-0"
            :leave-to="
              cn('opacity-0 -translate-x-10', {
                '-translate-x-10': position === 'left',
                'translate-x-10': position === 'right',
              })
            "
          >
          <!-- 
          /**
           * ส่วนที่สร้างกล่อง drawer
           * maxWidth ถ้า parent ไม่ส่งเข้ามา จะใช้ค่าเริ่มต้น 540px
           */ -->
            <div
              :class="cn('h-full w-full overflow-hidden bg-white')"
              :style="{
                maxWidth: maxWidth ? `${maxWidth}px` : '540px',
              }"
            >
              <slot />
            </div>
          </TransitionChild>
        </div>
      </div>
    </Teleport>
  </TransitionRoot>
</template>
