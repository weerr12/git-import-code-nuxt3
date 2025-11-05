<script setup lang="ts">
import { useTableInject } from './use-table-context'

const { variant } = useTableInject()!
</script>

<template>
  <tr :class="variant">
    <slot />
  </tr>
</template>

<style>
tr.headless:first-child td:first-child {
  border-top-left-radius: 8px;
}

tr.headless:first-child td:last-child {
  border-top-right-radius: 8px;
}
tr.headless:first-child td {
  border-top-width: 1px;
  border-top-color: var(--color-panels-gray-2);
}

tr.headless:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

tr.headless:last-child td:last-child {
  border-bottom-right-radius: 8px;
}
</style>
