<script setup lang="ts">
/**
 * cva
 * เป็น utility ที่ช่วยจัดการ class แบบมี “variant”
 * ตัวนี้กำหนดว่า divider มี variant (รูปแบบย่อย) 3 แบบ → divider1, divider2, divider3
 * ทุกแบบจะมี base class w-full (ให้เส้นกว้างเต็มหน้าจอ)
 */
import { cva } from 'class-variance-authority'

// 1) กำหนด class variants ของ Divider
const dividerVariants = cva('w-full', {
  variants: {
    variant: {
      divider1: 'border-divider-divider1', // เป็น theme ที่ custom เอง ไม่ใช่ของ tailwind  -> ../assets/css/variables.css
      divider2: 'border-divider-divider2',
      divider3: 'border-divider-divider3',
    },
  },
  defaultVariants: {
    variant: 'divider1',
  },
})

// 2) รับ props จาก component ที่เรียกใช้งาน
withDefaults(
  defineProps<{
    variant?: NonNullable<Parameters<typeof dividerVariants>[0]>['variant']
  }>(),
  {
    variant: 'divider1', // ค่า default ถ้าไม่ส่งมา
  }
)
</script>

<template>
  <hr :class="cn(dividerVariants({ variant }), $attrs.class ?? '')" />
</template>
