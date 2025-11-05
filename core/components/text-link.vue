<script setup lang="ts">
import { cva } from 'class-variance-authority'

/**
 * parent ส่ง
 * variant="secondary"
 * size="sm"
 * ใน component นี้จะได้ textLinkVariants({ variant: 'secondary', size: 'sm' }) และ spinnerVariants({ variant: 'secondary', size: 'sm' })
 */

/**
 * cva คือฟังก์ชันที่ช่วยจัดการ classnames ที่มีหลายๆ variant ได้ง่ายขึ้น
 * cva('base classes', { variants: { variantName: { option1: 'class1', option2: 'class2' } }, defaultVariants: { variantName: 'option1' } })
 * base classes คือ class ที่จะถูกใช้ในทุก variant
 * variants คือ object ที่กำหนดชื่อ variant และ option ของแต่ละ variant พร้อมกับ class ที่จะถูกใช้เมื่อเลือก option นั้น
 * defaultVariants คือ object ที่กำหนดค่าเริ่มต้นของแต่ละ variant ถ้าไม่ส่งเข้ามา
 */

/**
 * text-link component
 * variant: กำหนดสีของ link (primary, secondary, warning, danger)
 * size: กำหนดขนาดของ link (lg, regular, sm)
 */
const textLinkVariants = cva(
  ' inline-flex appearance-none items-center relative whitespace-nowrap align-middle shrink-0 hl-16px-500 rounded-lg cursor-pointer disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'text-cta-primary-default hover:text-cta-primary-hover hover:bg-basic-gray-20 active:text-cta-primary-clicked active:bg-basic-gray-30 disabled:text-cta-primary-disabled',
        secondary:
          'text-basic-gray-80 hover:text-basic-gray-70 active:text-basic-gray-90 hover:bg-basic-gray-20 disabled:text-basic-gray-50 active:bg-basic-gray-30',
        warning:
          'text-cta-warning-default hover:text-cta-warning-hover active:text-cta-warning-clicked hover:bg-basic-gray-20 disabled:text-cta-warning-disabled active:bg-basic-gray-30',
        danger:
          'text-cta-danger-default hover:text-cta-danger-hover active:text-cta-danger-clicked hover:bg-basic-gray-20 disabled:text-cta-danger-disabled active:bg-basic-gray-30',
      },
      size: {
        lg: 'h-12 min-w-12 hl-16px-400 px-4 gap-2',
        regular: 'h-10 min-w-10 hl-16px-400 px-4 gap-2',
        sm: 'h-8 min-h-8 hl-14px-400 px-2 gap-1',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'regular',
    },
  }
)

/**
 * spinner component
 * variant: กำหนดสีของ spinner (primary, secondary, warning, danger)
 * size: กำหนดขนาดของ spinner (lg, regular, sm)
 */
const spinnerVariants = cva('animate-spin', {
  variants: {
    variant: {
      primary: 'text-cta-primary-disabled',
      secondary: 'text-basic-gray-50',
      warning: 'text-cta-warning-disabled',
      danger: 'text-cta-danger-disabled',
    },
    size: {
      lg: 'text-2xl',
      regular: 'text-2xl',
      sm: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'regular',
  },
})
/**
 * NonNullable<Type> เอาไว้ให้ TypeScript รู้ว่า Type นี้จะไม่เป็น null หรือ undefined
 * Parameters<Type> เอาไว้ดึง type ของ parameters ของฟังก์ชันมาใช้
 * typeof เอาไว้ดึง type ของตัวแปรมาใช้
 * ตัวอย่างเช่น
 * function example(a: string, b: number): void {}
 * type Params = Parameters<typeof example> // [a: string, b: number]
 * type FirstParam = Params[0] // string
 * type SecondParam = Params[1] // number
 * ['variant'] คือการดึง type ของ parameter ตัวที่ 0 ของฟังก์ชัน textLinkVariants มาใช้
 * ตัวอย่างเช่น textLinkVariants({ variant: 'primary', size: 'lg' })
 * [0] คือ object { variant: 'primary', size: 'lg' }
 * ['variant'] -> เอาเฉพาะ type ของ key variant -> 'primary'
 */
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: NonNullable<Parameters<typeof textLinkVariants>[0]>['variant']
    size?: NonNullable<Parameters<typeof textLinkVariants>[0]>['size']
    href?: string
    target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null
    rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | (string & {}) | null
    loading?: boolean
    loadingText?: string
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'regular',
    href: undefined,
    target: '_self',
    loadingText: undefined,
    rel: null,
  }
)
</script>

<template>
  <!-- 
   /**
    * ถ้ามี href และไม่ disabled และไม่ loading ให้ render เป็น NuxtLink
    */
   -->

  <template v-if="!!href && !disabled && !loading">
    <NuxtLink
      :to="href"
      :target="target"
      :rel="rel"
      :class="cn(textLinkVariants({ variant, size }), $attrs.class ?? '')"
    >
      <!-- 
    /**
     * slot คือการส่ง content เข้าไปใน component 
     */ 
  -->
      <slot />
    </NuxtLink>
  </template>
  <!-- 
   /**
    * ถ้าไม่มี href หรือ disabled หรือ loading ให้ render เป็น button
    * ถ้า loading = true จะ disable ปุ่ม และแสดง spinner กับ loadingText (ถ้ามี)
    */
   -->
  <template v-else>
    <button
      :type="type"
      :class="cn(textLinkVariants({ variant, size }), $attrs.class ?? '')"
      :disabled="disabled || loading"
    >
      <template v-if="loading">
        <Icon name="ph:circle-notch" :class="cn(spinnerVariants({ variant, size }))" />
        <span v-if="loadingText">{{ loadingText }}</span>
      </template>
      <template v-else>
        <slot />
      </template>
    </button>
  </template>
</template>
