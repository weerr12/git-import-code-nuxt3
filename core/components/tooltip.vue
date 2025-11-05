<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

export interface TooltipProps {
  trigger?: 'hover' | 'click' | 'focus' | 'manual'
  delay?: number
  hideDelay?: number
  disabled?: boolean
  offset?: number
  arrow?: boolean
  theme?: 'dark' | 'light'
  maxWidth?: string
  zIndex?: number
  content?: string
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end'
}

const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  placement: 'top',
  trigger: 'hover',
  delay: 100,
  hideDelay: 100,
  disabled: false,
  offset: 8,
  arrow: true,
  theme: 'dark',
  maxWidth: '320px',
  zIndex: 9999,
})

const emit = defineEmits<{
  show: []
  hide: []
}>()

const isVisible = ref(false)
const triggerRef = ref<HTMLElement>()
const tooltipRef = ref<HTMLElement>()
const position = ref({ top: 0, left: 0 })
const actualPlacement = ref(props.placement)

const { start: startShowTimer, stop: stopShowTimer } = useTimeoutFn(
  () => {
    if (!props.disabled) {
      show()
    }
  },
  props.delay,
  { immediate: false }
)

const { start: startHideTimer, stop: stopHideTimer } = useTimeoutFn(
  () => {
    hide()
  },
  props.hideDelay,
  { immediate: false }
)

const tooltipClasses = computed(() => {
  const baseClasses =
    'hl-14px-400 absolute rounded-sm px-2 py-1 pointer-events-none transform transition-opacity duration-200'

  const themeClasses = {
    dark: 'bg-black/90 text-white shadow-lg',
    light: 'bg-white text-gray-900 border border-gray-200 shadow-lg',
  }

  return `${baseClasses} ${themeClasses[props.theme]}`
})

const arrowClasses = computed(() => {
  const placement = actualPlacement.value
  const baseClasses = 'absolute w-2 h-2'

  let borderClasses = ''

  if (props.theme === 'light') {
    // Only show borders that create the arrow effect
    switch (true) {
      case placement.startsWith('top'):
        borderClasses = 'fill-white drop-shadow-xl/20'
        break
      case placement.startsWith('bottom'):
        borderClasses = 'border-r border-b border-gray-200'
        break
      case placement.startsWith('left'):
        borderClasses = 'border-l border-b border-gray-200'
        break
      case placement.startsWith('right'):
        borderClasses = 'border-r border-t border-gray-200'
        break
    }
  }

  const themeClasses = {
    dark: 'bg-gray-900',
    light: `bg-white ${borderClasses}`,
  }

  return `${baseClasses} ${themeClasses[props.theme]}`
})

// Helper functions for position calculation
function getHorizontalPosition(
  placement: string,
  triggerRect: DOMRect,
  tooltipWidth: number
): number {
  if (placement.endsWith('-start')) {
    return triggerRect.left
  }
  if (placement.endsWith('-end')) {
    return triggerRect.right - tooltipWidth
  }
  // Center alignment
  return triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2
}

function getVerticalPosition(
  placement: string,
  triggerRect: DOMRect,
  tooltipHeight: number
): number {
  if (placement.endsWith('-start')) {
    return triggerRect.top
  }
  if (placement.endsWith('-end')) {
    return triggerRect.bottom - tooltipHeight
  }
  // Center alignment
  return triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2
}

function getBasePosition(
  placement: string,
  triggerRect: DOMRect,
  tooltipRect: DOMRect
): { top: number; left: number } {
  const tooltipWidth = tooltipRect.width
  const tooltipHeight = tooltipRect.height

  switch (true) {
    case placement.startsWith('top'):
      return {
        top: triggerRect.top - tooltipHeight - props.offset,
        left: getHorizontalPosition(placement, triggerRect, tooltipWidth),
      }

    case placement.startsWith('bottom'):
      return {
        top: triggerRect.bottom + props.offset,
        left: getHorizontalPosition(placement, triggerRect, tooltipWidth),
      }

    case placement.startsWith('left'):
      return {
        top: getVerticalPosition(placement, triggerRect, tooltipHeight),
        left: triggerRect.left - tooltipWidth - props.offset,
      }

    case placement.startsWith('right'):
      return {
        top: getVerticalPosition(placement, triggerRect, tooltipHeight),
        left: triggerRect.right + props.offset,
      }

    default:
      return { top: 0, left: 0 }
  }
}

function calculatePosition() {
  if (!triggerRef.value || !tooltipRef.value) return

  // Get first child element of the trigger (the actual slot content)
  const slotElement = triggerRef.value.firstElementChild as HTMLElement
  const referenceElement = slotElement || triggerRef.value

  const triggerRect = referenceElement.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let top = 0
  let left = 0
  let placement = props.placement

  // Calculate base position using helper functions
  const basePosition = getBasePosition(placement, triggerRect, tooltipRect)
  top = basePosition.top
  left = basePosition.left

  // Auto-adjust if tooltip goes outside viewport
  if (left < 0) {
    left = 8
  } else if (left + tooltipRect.width > viewportWidth) {
    left = viewportWidth - tooltipRect.width - 8
  }

  if (top < 0) {
    if (placement.startsWith('top')) {
      // Flip to bottom
      top = triggerRect.bottom + props.offset
      placement = placement.replace('top', 'bottom') as typeof props.placement
    } else {
      top = 8
    }
  } else if (top + tooltipRect.height > viewportHeight) {
    if (placement.startsWith('bottom')) {
      // Flip to top
      top = triggerRect.top - tooltipRect.height - props.offset
      placement = placement.replace('bottom', 'top') as typeof props.placement
    } else {
      top = viewportHeight - tooltipRect.height - 8
    }
  }

  position.value = {
    top: top + window.scrollY,
    left: left + window.scrollX,
  }

  actualPlacement.value = placement
}

// Arrow style helper functions
function getArrowTransform(placement: string): string {
  const isCenter = !placement.includes('-')
  const baseRotation = 'rotate(45deg)'

  if (isCenter) {
    if (placement.startsWith('top') || placement.startsWith('bottom')) {
      return `translateX(-50%) ${baseRotation}`
    } else {
      return `translateY(-50%) ${baseRotation}`
    }
  }

  return baseRotation
}

function getArrowPositioning(placement: string): Record<string, string> {
  const positioning: Record<string, string> = {}
  const isStart = placement.endsWith('-start')
  const isEnd = placement.endsWith('-end')
  const edgeOffset = '12px'
  const centerOffset = '50%'

  switch (true) {
    case placement.startsWith('top'):
      positioning.bottom = '-4px'
      if (isStart) {
        positioning.left = edgeOffset
      } else if (isEnd) {
        positioning.right = edgeOffset
      } else {
        positioning.left = centerOffset
      }
      break

    case placement.startsWith('bottom'):
      positioning.top = '-4px'
      if (isStart) {
        positioning.left = edgeOffset
      } else if (isEnd) {
        positioning.right = edgeOffset
      } else {
        positioning.left = centerOffset
      }
      break

    case placement.startsWith('left'):
      positioning.right = '-4px'
      if (isStart) {
        positioning.top = edgeOffset
      } else if (isEnd) {
        positioning.bottom = edgeOffset
      } else {
        positioning.top = centerOffset
      }
      break

    case placement.startsWith('right'):
      positioning.left = '-4px'
      if (isStart) {
        positioning.top = edgeOffset
      } else if (isEnd) {
        positioning.bottom = edgeOffset
      } else {
        positioning.top = centerOffset
      }
      break
  }

  return positioning
}

function getArrowStyle() {
  if (!props.arrow) return {}

  const placement = actualPlacement.value
  const positioning = getArrowPositioning(placement)
  const transform = getArrowTransform(placement)

  return {
    ...positioning,
    transform,
  }
}

async function show() {
  if (isVisible.value || props.disabled) return

  stopHideTimer()
  isVisible.value = true
  emit('show')

  await nextTick()
  calculatePosition()
}

function hide() {
  if (!isVisible.value) return

  stopShowTimer()
  isVisible.value = false
  emit('hide')
}

function handleMouseEnter() {
  if (props.trigger === 'hover') {
    stopHideTimer()
    startShowTimer()
  }
}

function handleMouseLeave() {
  if (props.trigger === 'hover') {
    stopShowTimer()
    startHideTimer()
  }
}

function handleClick() {
  if (props.trigger === 'click') {
    if (isVisible.value) {
      hide()
    } else {
      show()
    }
  }
}

function handleFocus() {
  if (props.trigger === 'focus') {
    show()
  }
}

function handleBlur() {
  if (props.trigger === 'focus') {
    hide()
  }
}

// Expose methods for manual control
defineExpose({
  show,
  hide,
  isVisible: computed(() => isVisible.value),
})
</script>

<template>
  <div class="inline-block">
    <div
      ref="triggerRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @focusin="handleFocus"
      @focusout="handleBlur"
    >
      <slot />
    </div>

    <Teleport to="body">
      <div
        v-if="isVisible"
        ref="tooltipRef"
        :class="tooltipClasses"
        :style="{
          top: `${position.top}px`,
          left: `${position.left}px`,
          maxWidth: maxWidth,
          zIndex: zIndex,
          opacity: isVisible ? '1' : '0',
        }"
        role="tooltip"
      >
        <slot name="content">
          {{ content }}
        </slot>

        <div v-if="arrow" :class="arrowClasses" :style="getArrowStyle()" />
      </div>
    </Teleport>
  </div>
</template>
