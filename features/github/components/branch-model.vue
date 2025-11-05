<script setup lang="ts">
import type { Branch } from "../types/github";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const props = defineProps<{
  projectId: string;
  branches: Branch[];
  defaultBranch?: string;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "compare", base: string, compare: string): void;
}>();

const colorMode = useColorMode();
const baseBranch = ref<Branch | null>(null);
const compareBranch = ref<Branch | null>(null);

watch(
  () => props.branches,
  (newBranches) => {
    if (newBranches.length > 0 && !baseBranch.value) {
      baseBranch.value =
        newBranches.find((b) => b.name === props.defaultBranch) ||
        newBranches[0];
    }
  },
  { immediate: true }
);

const canCompare = computed(() => {
  return (
    baseBranch.value &&
    compareBranch.value &&
    baseBranch.value.name !== compareBranch.value.name
  );
});

const handleCompare = () => {
  if (canCompare.value) {
    emit("compare", baseBranch.value!.name, compareBranch.value!.name);
    navigateTo(
      `/project/${props.projectId}/compare?base=${
        baseBranch.value!.name
      }&compare=${compareBranch.value!.name}`
    );
  }
};

const handleClose = () => {
  emit("close");
};
</script>

<template>
  <div>
    <UiModal :open="isOpen" @close="handleClose">
      <UiModalBody>
        <div class="gap-6 flex flex-col">
          <p class="hl-14px-400 text-basic-gray-70">
            Compare changes between two branches to see what's different.
          </p>

          <div class="flex items-center gap-4">
            <div class="flex-1">
              <UiLabel class="mb-2 text-basic-gray-70">Base Branch</UiLabel>
              <Listbox v-model="baseBranch">
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
                    <span class="block truncate">
                      {{ baseBranch?.name || "Select base branch" }}
                    </span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <Icon
                        name="ph:caret-down"
                        size="20"
                        class="text-basic-gray-60"
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
                          >
                            {{ branch.name }}
                          </span>
                          <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-ci-primary"
                          >
                            <Icon name="ph:check" size="20" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>

            <div class="pt-6 text-basic-gray-70">VS</div>

            <div class="flex-1">
              <UiLabel class="mb-2 text-basic-gray-70">Compare Branch</UiLabel>
              <Listbox v-model="compareBranch">
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
                      {{ compareBranch?.name || "Select compare branch" }}
                    </span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <Icon
                        name="ph:caret-down"
                        size="20"
                        class="text-basic-gray-60"
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
                          >
                            {{ branch.name }}
                          </span>
                          <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-ci-primary"
                          >
                            <Icon name="ph:check" size="20" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
      </UiModalBody>
      <UiModalFooter>
        <div class="flex justify-end gap-3">
          <UiButton variant="secondary" @click="handleClose"> Cancel </UiButton>
          <UiButton
            variant="primary"
            :disabled="!canCompare"
            @click="handleCompare"
          >
            <Icon name="ph:git-compare" size="18" />
            Compare Branches
          </UiButton>
        </div>
      </UiModalFooter>
    </UiModal>
  </div>
</template>
