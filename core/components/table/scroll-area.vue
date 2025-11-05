<script setup lang="ts">
/**
 * cva คือฟังก์ชันที่ช่วยจัดการ classnames ที่มีหลายๆ variant ได้ง่ายขึ้น
 */
import { cva } from 'class-variance-authority'

/**
 * cva คือฟังก์ชันที่ช่วยจัดการ classnames ที่มีหลายๆ variant ได้ง่ายขึ้น
 * cva('base classes', { variants: { variantName: { option1: 'class1', option2: 'class2' } }, defaultVariants: { variantName: 'option1' } })
 * base classes คือ class ที่จะถูกใช้ในทุก variant
 * variants คือ object ที่กำหนดชื่อ variant และ option ของแต่ละ variant พร้อมกับ class ที่จะถูกใช้เมื่อเลือก option นั้น
 * defaultVariants คือ object ที่กำหนดค่าเริ่มต้นของแต่ละ variant ถ้าไม่ส่งเข้ามา
 */
const tableScrollAreaVariants = cva('block max-w-full overflow-auto whitespace-nowrap', {
  variants: {
    variant: {
      default: 'border-panels-gray-1 rounded-lg border',
      solid: ' rounded-2xl bg-basic-gray-10 p-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
/**
 * NonNullable<Parameters<typeof tableScrollAreaVariants>[0]>['variant']
 * NonNullable<> -> เอาไว้ให้ TypeScript รู้ว่า Type นี้จะไม่เป็น null หรือ undefined
 * Parameters<typeof tableScrollAreaVariants>[0] -> เอา type ของ parameter ตัวแรกของฟังก์ชัน tableScrollAreaVariants
 * ตัวอย่างเช่น parent ส่ง { variant: 'solid' } ใน component tableScrollAreaVariants จะได้ type เป็น { variant: 'solid' }
 */
withDefaults(
  defineProps<{
    variant?: NonNullable<Parameters<typeof tableScrollAreaVariants>[0]>['variant']
  }>(),
  {
    variant: 'default',
  }
)
</script>

<template>
  <div :class="cn(tableScrollAreaVariants({ variant }), $attrs.class ?? '')">
    <slot />
  </div>
</template>
