<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { useGithubStore } from "~/core/store/github-store";

const githubStore = useGithubStore();
const colorMode = useColorMode();

const handleLogout = async () => {
  await githubStore.logout();
  navigateTo("/auth/signin");
};
</script>

<template>
  <Menu as="div" class="relative">
    <MenuButton as="template" class="cursor-pointer">
      <button
        :class="[
          cn('inline-flex items-center gap-2 px-3 py-2 rounded-xl', {
            'hover:bg-basic-gray-20': colorMode.preference === 'light',
            'hover:bg-gray-800': colorMode.preference === 'dark',
          }),
        ]"
      >
        <img
          v-if="githubStore.user?.avatar_url"
          :src="githubStore.user.avatar_url"
          :alt="githubStore.user.login"
          class="w-8 h-8 rounded-full"
        />
        <span class="text-sm hl-16px-400 text-gray-500">
          {{ githubStore.user?.login || "User" }}
        </span>
        <Icon name="ph:caret-down" size="16" class="text-gray-500" />
      </button>
    </MenuButton>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        :class="[
          cn(
            'absolute right-0 mt-2 w-56 rounded-lg border border-divider-divider2 bg-white z-50 focus:outline-none',
            {
              'bg-panels-white border-divider-divider2':
                colorMode.preference === 'light',
              'bg-gray-800 border-gray-700 text-gray-200':
                colorMode.preference === 'dark',
            }
          ),
        ]"
      >
        <div
          :class="[
            cn('p-4 border-b ', {
              'border-divider-divider2': colorMode.preference === 'light',
              'border-gray-700': colorMode.preference === 'dark',
            }),
          ]"
        >
          <div class="flex items-center gap-3">
            <img
              v-if="githubStore.user?.avatar_url"
              :src="githubStore.user.avatar_url"
              :alt="githubStore.user.login"
              class="w-10 h-10 rounded-full"
            />
            <div class="flex-1 min-w-0">
              <p class="hl-16px-400 truncate">
                {{ githubStore.user?.name || githubStore.user?.login }}
              </p>
              <p class="hl-14px-400 text-gray-500 truncate">
                @{{ githubStore.user?.login }}
              </p>
            </div>
          </div>
        </div>

        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="handleLogout"
              :class="[
                cn(
                  'w-full text-left px-4 py-2 text-sm text-red-600 flex items-center gap-2 cursor-pointer'
                ),
                { 'bg-red-50': active },
              ]"
            >
              <Icon name="ph:sign-out" size="18" />
              Logout
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Transition>
  </Menu>
</template>
