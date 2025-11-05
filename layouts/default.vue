<script setup lang="ts">
import LogoSvg from "../assets/icons/logo.svg";
import UserProfileDropdown from "~/features/profile/components/user-profile-dropdown.vue";

const githubStore = useGithubStore();
const colorMode = useColorMode();
</script>

<template>
  <div class="h-screen">
    <nav
      :class="[
        cn('flex h-20 items-center justify-between shadow px-6 py-4 ', {
          'border-divider-divider1': colorMode.preference === 'light',
          'border-gray-900 bg-gray-900': colorMode.preference === 'dark',
        }),
      ]"
    >
      <NuxtLink to="/" class="flex items-center gap-6">
        <img
          :src="LogoSvg"
          alt="Logo"
          :class="[
            cn('transition-all duration-300', {
              'filter-none': colorMode.preference === 'light',
              invert: colorMode.preference === 'dark',
            }),
          ]"
        />
      </NuxtLink>
      <div class="flex items-center gap-2">
        <UiButton
          variant="secondary"
          size="regular"
          :class="[
            cn('boreder', {
              'border-divider-divider2': colorMode.preference === 'light',
              'border-gray-700': colorMode.preference === 'dark',
            }),
          ]"
          @click="
            colorMode.preference =
              colorMode.preference === 'light' ? 'dark' : 'light'
          "
        >
          <Icon
            :name="colorMode.preference === 'light' ? 'ph:moon' : 'ph:sun'"
            size="24"
          />
        </UiButton>
        <NuxtLink
          v-if="!githubStore.isAuthenticated"
          to="/auth/signin"
          class="flex items-center gap-6"
        >
          <UiButton variant="primary" size="sm" class="p-3"
            >เข้าสู่ระบบ</UiButton
          >
        </NuxtLink>
        <UserProfileDropdown v-else />
      </div>
    </nav>
    <main class="relative overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<style>
.dark-mode body {
  background-color: #020817;
  color: #ebf4f1;
}
</style>
