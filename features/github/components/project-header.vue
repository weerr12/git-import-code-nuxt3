<script setup lang="ts">
import type { Repository } from "~/features/github/types/github";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

defineProps<{
  repository: Repository;
  branch: string;
}>();

const emit = defineEmits<{
  (e: "back"): void;
  (e: "compare"): void;
}>();

const colorMode = useColorMode();
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <button
        @click="$emit('back')"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-panels-gray-1 transition-colors"
        aria-label="Go back"
      >
        <Icon name="ph:arrow-left" size="24" />
      </button>

      <div class="flex-1">
        <h1 class="hl-24px-600">
          {{ repository.name }}
        </h1>
        <p class="hl-14px-400 text-basic-gray-70">
          {{ repository.full_name }}
        </p>
      </div>

      <UiBadge
        :variant="repository.private ? 'default' : 'default-solid'"
        size="sm"
        border-radious="rounded"
        class="flex items-center justify-center gap-1"
      >
        <Icon
          :name="repository.private ? 'ph:lock' : 'ph:globe'"
          size="12"
          class="mr-1"
        />
        {{ repository.private ? "Private" : "Public" }}
      </UiBadge>

      <Menu as="div" class="relative">
        <MenuButton
          :class="[
            cn('inline-flex h-9 w-9 items-center justify-center rounded-md '),
            {
              'hover:bg-panels-gray-1 ': colorMode.preference === 'light',
              'hover:bg-gray-700': colorMode.preference === 'dark',
            },
          ]"
          aria-label="More options"
        >
          <Icon name="ph:dots-three-vertical" size="24" />
        </MenuButton>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems
            :class="[
              cn(
                'absolute right-0 mt-1 w-56 rounded-lg z-50 border focus:outline-none',
                {
                  'bg-white border-divider-divider1':
                    colorMode.preference === 'light',
                  'bg-gray-800 border-gray-700':
                    colorMode.preference === 'dark',
                }
              ),
            ]"
          >
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <button
                  @click="emit('compare')"
                  :class="
                    cn(
                      'w-full text-left rounded-lg px-4 py-2 text-sm flex items-center gap-2',
                      {
                        'bg-gray-100 text-gray-900':
                          active && colorMode.preference === 'light',

                        'bg-gray-700 text-white':
                          active && colorMode.preference === 'dark',
                      }
                    )
                  "
                >
                  <Icon name="ph:git-compare" size="18" />
                  Compare
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>

    <div
      :class="[
        cn('rounded-lg border'),
        {
          'bg-panels-white border-input-field-border-default text-gray-900':
            colorMode.preference === 'light',
          'bg-gray-800 text-white border-gray-700':
            colorMode.preference === 'dark',
        },
      ]"
    >
      <div
        :class="[
          cn('border-b px-6 py-4'),
          {
            'bg-panels-white border-input-field-border-default text-gray-900':
              colorMode.preference === 'light',
            'bg-gray-800 text-white border-gray-700':
              colorMode.preference === 'dark',
          },
        ]"
      >
        <h2 class="hl-20px-600">Repository Information</h2>
      </div>

      <div class="gap-4 flex px-6 py-4">
        <div class="flex gap-4 items-center justify-center">
          <Icon
            name="ph:git-branch"
            size="20"
            class="mt-0.5 text-basic-gray-60"
          />
          <div class="flex-1">
            <p class="hl-14px-600">Current Branch</p>
            <p class="hl-14px-400 text-basic-gray-70">
              {{ branch }}
            </p>
          </div>
        </div>

        <div
          v-if="repository.description"
          class="rounded-lg border border-divider-divider1 p-4"
        >
          <p class="hl-14px-400 text-basic-gray-70">
            {{ repository.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
