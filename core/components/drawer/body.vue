<template>
  <div :class="cn('px-4 pb-4 md:px-6 md:pb-6', $attrs.class ?? '')">
    <slot />
  </div>
</template>
