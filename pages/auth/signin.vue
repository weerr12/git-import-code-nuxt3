<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

const githubStore = useGithubStore();
</script>

<template>
  <ClientOnly>
    <div
      class="flex min-h-screen w-full items-center justify-center bg-panels-gray-2"
    >
      <div class="mx-auto flex w-full flex-col items-center px-4">
        <div
          class="w-full max-w-[420px] rounded-xl border border-divider-divider1 bg-panels-white p-8 shadow-lg"
        >
          <div class="mb-8 text-center text-gray-500">
            <h1 class="hl-24px-600 mb-2">Welcome back!</h1>
            <p class="hl-14px-400 text-basic-gray-70">
              Connect your GitHub account to import repositories
            </p>
          </div>

          <UiButton
            variant="primary"
            size="regular"
            class="w-full mb-6"
            @click="githubStore.login"
          >
            <Icon name="ph:github-logo" size="24" />
            Connect with GitHub
          </UiButton>

          <div class="flex items-center gap-4 mb-6">
            <hr class="flex-1 border-divider-divider2" />
            <span class="hl-12px-400 text-basic-gray-60">or</span>
            <hr class="flex-1 border-divider-divider2" />
          </div>

          <div class="mt-8 text-center">
            <p class="hl-12px-400 text-basic-gray-60">
              ©2025 ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
