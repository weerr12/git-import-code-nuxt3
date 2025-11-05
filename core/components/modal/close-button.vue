<template>
  <button
    type="button"
    :class="
      cn(
        'flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg',
        'text-basic-gray-80 hover:bg-basic-gray-20 hover:text-basic-gray-70 active:bg-basic-gray-30 active:text-basic-gray-90',
        $attrs.class ?? ''
      )
    "
  >
    <Icon name="ph:x" size="20" />
  </button>
</template>
