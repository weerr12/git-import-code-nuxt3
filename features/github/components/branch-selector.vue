<script setup lang="ts">
import type { Repository, Branch } from "~/features/github/types/github";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const props = defineProps<{
  repository: Repository;
}>();

const emit = defineEmits<{
  (e: "selected-branch", branch: Branch): void;
  (e: "import", branchName: string): void;
}>();

const [owner, repo] = props.repository.full_name.split("/");
const { branches, isLoading, error, fetchBranches } = useGitHubBranches(
  owner,
  repo
);
const selectedBranch = ref<Branch | null>(null);
const colorMode = useColorMode();
const handleImport = () => {
  if (selectedBranch.value) {
    emit("selected-branch", selectedBranch.value);
    emit("import", selectedBranch.value.name);
  }
};

onMounted(() => {
  fetchBranches();
});
</script>

<template>
  <div class="flex flex-col gap-4 relative">
    <div class="flex flex-col gap-2">
      <UiLabel for="branch-select">Select Branch</UiLabel>

      <template v-if="!isLoading && branches.length > 0">
        <Listbox v-model="selectedBranch">
          <div class="relative">
            <ListboxButton
              :class="
                cn(
                  'relative w-full cursor-pointer rounded-lg border py-2.5 pl-3 pr-10 text-left hover:border-input-field-border-focused focus:outline-none hl-14px-400',
                  {
                    'bg-white border-input-field-border-default text-gray-900':
                      colorMode.preference === 'light',
                    'bg-gray-800 text-white border-gray-700':
                      colorMode.preference === 'dark',
                  }
                )
              "
            >
              <span
                :class="
                  cn('block truncate', {
                    'text-gray-500': colorMode.preference === 'light',
                    'text-gray-400': colorMode.preference === 'dark',
                  })
                "
              >
                {{ selectedBranch?.name || "Select a branch" }}
              </span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <Icon
                  name="ph:caret-down"
                  size="20"
                  class="text-basic-gray-60"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <ListboxOptions
                :class="
                  cn(
                    'absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg py-1 text-base shadow-xl ring-1 focus:outline-none hl-14px-400',
                    {
                      'bg-white ring-black/10':
                        colorMode.preference === 'light',
                      'bg-gray-800 ring-white/10':
                        colorMode.preference === 'dark',
                    }
                  )
                "
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="branch in branches"
                  :key="branch.name"
                  :value="branch"
                  as="template"
                >
                  <li
                    :class="
                      cn(
                        'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors',
                        {
                          'bg-ci-primary/10 text-ci-primary': active,
                          'text-gray-900':
                            !active && colorMode.preference === 'light',
                          'text-gray-100':
                            !active && colorMode.preference === 'dark',
                        }
                      )
                    "
                  >
                    <span
                      :class="
                        cn('block truncate hl-14px-400', {
                          'hl-14px-600': selected,
                        })
                      "
                      >{{ branch.name }}</span
                    >
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-ci-primary"
                    >
                      <Icon name="ph:check" size="20" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </template>

      <UiHelper v-if="error" variant="error">{{ error }}</UiHelper>
      <UiHelper v-else
        >Choose which branch to import from this repository</UiHelper
      >
    </div>

    <UiButton
      :disabled="isLoading"
      :loading="isLoading"
      variant="secondary"
      @click="handleImport"
      :class="
        (cn('w-full'),
        {
          'bg-panels-white border-input-field-border-default text-gray-900':
            colorMode.preference === 'light',
          'bg-gray-800 text-white border-gray-700':
            colorMode.preference === 'dark',
        })
      "
    >
      Import {{ repository.name }}
    </UiButton>
  </div>
</template>
