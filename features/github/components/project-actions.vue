<script setup lang="ts">
defineEmits<{
  (e: "open-github"): void;
  (e: "download-zip"): void;
}>();

const colorMode = useColorMode();
</script>

<template>
  <div
    :class="[
      cn('rounded-lg border'),
      {
        'border-divider-divider1': colorMode.preference === 'light',
        'border-gray-700': colorMode.preference === 'dark',
      },
    ]"
  >
    <div class="flex flex-col gap-3 px-6 py-4">
      <UiButton
        variant="secondary"
        :class="[
          cn('w-full justify-start'),
          {
            'bg-panels-white border-input-field-border-default text-gray-900':
              colorMode.preference === 'light',
            'bg-gray-800 text-white border-gray-700':
              colorMode.preference === 'dark',
          },
        ]"
        @click="$emit('open-github')"
      >
        <Icon name="ph:folder-simple-dashed" size="16" />
        Open in GitHub
        <Icon name="ph:arrow-square-out" size="16" class="ml-auto" />
      </UiButton>

      <UiButton
        variant="primary"
        class="w-full justify-start"
        @click="$emit('download-zip')"
      >
        <Icon name="ph:download-simple" size="16" />
        Download ZIP
      </UiButton>
    </div>
  </div>
</template>
