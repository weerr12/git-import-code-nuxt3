<script setup lang="ts">
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex appearance-none items-center justify-center relative whitespace-nowrap align-middle shrink-0 px-4 gap-2 rounded-lg cursor-pointer disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'text-white bg-cta-primary-default hover:bg-cta-primary-hover active:bg-cta-primary-clicked disabled:bg-cta-primary-disabled',
        'primary-outline':
          'text-cta-primary-default hover:text-cta-primary-hover active:text-cta-primary-clicked disabled:text-cta-primary-disabled border border-cta-primary-default hover:border-cta-primary-hover active:border-cta-primary-clicked disabled:border-cta-primary-disabled',
        secondary:
          'text-basic-gray-80 border border-panels-outline-3 hover:bg-basic-gray-20 hover:text-basic-gray-70 active:bg-basic-gray-30 active:text-basic-gray-90 disabled:border-panels-outline-2 disabled:text-basic-gray-50',
        ghost:
          'text-basic-gray-80 hover:bg-basic-gray-20 hover:text-basic-gray-70 active:bg-basic-gray-30 active:text-basic-gray-90  disabled:text-basic-gray-50',
        warning:
          'text-white bg-cta-warning-default hover:bg-cta-warning-hover active:bg-cta-warning-clicked disabled:bg-cta-warning-disabled',
        'warning-outline':
          'text-cta-warning-default hover:text-cta-warning-hover active:text-cta-warning-clicked disabled:text-cta-warning-disabled border border-cta-warning-default hover:border-cta-warning-hover active:border-cta-warning-clicked disabled:border-cta-warning-disabled',
        danger:
          'text-white bg-cta-danger-default hover:bg-cta-danger-hover active:bg-cta-danger-clicked disabled:bg-cta-danger-disabled',
        'danger-outline':
          'text-cta-danger-default hover:text-cta-danger-hover active:text-cta-danger-clicked disabled:text-cta-danger-disabled border border-cta-danger-default hover:border-cta-danger-hover active:border-cta-danger-clicked disabled:border-cta-danger-disabled',
        'danger-ghost':
          'text-cta-danger-default hover:bg-basic-gray-20 hover:text-cta-danger-hover active:bg-basic-gray-30 active:text-cta-danger-clicked  disabled:text-cta-danger-disabled',
      },
      size: {
        lg: 'text-2xl h-12 w-12',
        regular: 'text-xl h-10 w-10',
        sm: 'text-base h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'regular',
    },
  }
)

const spinnerVariants = cva('animate-spin shrink-0', {
  variants: {
    variant: {
      primary: 'text-white',
      'primary-outline': 'text-cta-primary-disable',
      secondary: 'text-basic-gray-50',
      ghost: 'text-basic-gray-50',
      warning: 'text-white',
      'warning-outline': 'text-cta-warning-disable',
      danger: 'text-white',
      'danger-outline': 'text-cta-danger-disable',
      'danger-ghost': 'text-cta-danger-disable',
    },
    size: {
      lg: 'text-2xl',
      regular: 'text-xl',
      sm: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'regular',
  },
})

const iconVariants = cva('shrink-0', {
  variants: {
    size: {
      lg: 'text-2xl',
      regular: 'text-xl',
      sm: 'text-base',
    },
  },
  defaultVariants: {
    size: 'regular',
  },
})

withDefaults(
  defineProps<{
    iconName: string
    type?: 'button' | 'submit' | 'reset'
    variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
    size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'regular',
  }
)
</script>
<template>
  <button
    :type="type"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
    :disabled="disabled || loading"
  >
    <template v-if="loading">
      <Icon name="ph:circle-notch" :class="cn(spinnerVariants({ variant, size }))" />
    </template>
    <template v-else>
      <Icon :name="iconName" :class="cn(iconVariants({ size }))" />
    </template>
  </button>
</template>
