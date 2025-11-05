<script setup lang="ts">
defineProps<{
  value: string
}>()

const isCopied = ref<boolean>(false)

function copyToClipboard(text: string): Promise<void> {
  isCopied.value = true

  setTimeout(() => {
    isCopied.value = false
  }, 3000)

  if (navigator.clipboard && window.isSecureContext) {
    // Modern Clipboard API (HTTPS only)
    return navigator.clipboard.writeText(text).catch((err) => {
      console.error('Clipboard API failed', err)
      return Promise.reject(err)
    })
  } else {
    // Fallback for older browsers or insecure contexts
    return new Promise<void>((resolve, reject) => {
      const textarea = document.createElement('textarea')
      textarea.value = text

      // Prevent scrolling on iOS
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      textarea.style.opacity = '0' // Hide the element

      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()

      try {
        const successful = document.execCommand('copy')
        if (successful) {
          resolve()
        } else {
          reject(new Error('Fallback: copy command failed'))
        }
      } catch (err) {
        reject(err)
      } finally {
        document.body.removeChild(textarea)
      }
    })
  }
}
</script>

<template>
  <UiButton variant="secondary" class="w-[155px]" @click="copyToClipboard(value)">
    <Icon :name="isCopied ? 'ph:check' : 'ph:copy'" size="24" />
    {{ isCopied ? 'Copied!' : 'Copy code' }}
  </UiButton>
</template>
