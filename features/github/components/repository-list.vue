<script setup lang="ts">
import type { Repository } from "~/features/github/types/github";
import BranchSelector from "./branch-selector.vue";

const emit = defineEmits<{
  (e: "import-repo", repo: Repository, branch: string): void;
}>();

const { repositories, isLoading, error, fetchRepositories } = useGitHubRepos();
const { formatRelativeTime } = useDateFormat();

const searchQuery = ref<string>("");
const selectedRepo = ref<Repository | null>(null);
const colorMode = useColorMode();

const filteredRepos = computed(() => {
  return repositories.value.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const toggleRepo = (repo: Repository) => {
  if (selectedRepo.value?.id === repo.id) {
    selectedRepo.value = null;
  } else {
    selectedRepo.value = repo;
  }
};

const handleImport = (branch: string) => {
  if (selectedRepo.value) {
    emit("import-repo", selectedRepo.value, branch);
  }
};

onMounted(() => {
  fetchRepositories();
});
</script>

<template>
  <div class="h-screen p-6">
    <div class="mx-auto max-w-[900px] w-full">
      <div class="mb-8">
        <h1 class="hl-30px-600 mb-2">Import Git Repository</h1>
        <p class="hl-16px-400 text-basic-gray-70">
          Select a repository from your GitHub account to import
        </p>
      </div>

      <div
        :class="[
          cn('rounded-lg border'),
          {
            'border-divider-divider1': colorMode.preference === 'light',
            'border-gray-700': colorMode.preference === 'dark',
          },
        ]"
      >
        <div
          :class="[
            cn('border-b  px-6 py-4'),
            {
              'border-b border-divider-divider1':
                colorMode.preference === 'light',
              'border-b border-gray-700': colorMode.preference === 'dark',
            },
          ]"
        >
          <h2 class="hl-20px-600">Your Repositories</h2>
          <p class="hl-14px-400 text-basic-gray-70">
            Choose a repository and branch to import
          </p>
        </div>

        <div class="px-6 py-4">
          <div class="mb-4">
            <UiTextInput
              v-model="searchQuery"
              type="search"
              placeholder="Search repositories..."
              icon-name="ph:magnifying-glass"
              icon-position="left"
              :disabled="isLoading"
            />
          </div>

          <div
            v-if="isLoading"
            class="py-12 flex flex-col items-center justify-center"
          >
            <Icon
              name="ph:circle-notch"
              size="48"
              class="text-ci-primary animate-spin mb-4"
            />
            <p class="hl-14px-400 text-basic-gray-70">
              Loading repositories...
            </p>
          </div>

          <div v-else class="flex flex-col gap-2">
            <div
              v-for="repo in filteredRepos"
              :key="repo.id"
              :class="[
                cn('rounded-lg border'),
                {
                  'border-divider-divider1': colorMode.preference === 'light',
                  'border-gray-700': colorMode.preference === 'dark',
                },
              ]"
            >
              <button @click="toggleRepo(repo)" class="w-full p-4 text-left">
                <div class="flex items-start justify-between cursor-pointer">
                  <div class="flex-1">
                    <div class="mb-1 flex items-center gap-2">
                      <span class="hl-14px-600">
                        {{ repo.name }}
                      </span>
                      <UiBadge
                        :variant="repo.private ? 'default' : 'default-solid'"
                        size="sm"
                        border-radious="rounded"
                        class="flex items-center justify-center gap-1"
                      >
                        <Icon
                          :name="repo.private ? 'ph:lock' : 'ph:globe'"
                          size="12"
                          class="mr-1"
                        />
                        {{ repo.private ? "Private" : "Public" }}
                      </UiBadge>
                    </div>
                    <p
                      v-if="repo.description"
                      class="hl-14px-400 text-basic-gray-70"
                    >
                      {{ repo.description }}
                    </p>
                    <p class="mt-1 hl-12px-400 text-basic-gray-60">
                      Updated {{ formatRelativeTime(repo.updated_at) }}
                    </p>
                  </div>
                  <Icon
                    name="ph:caret-right"
                    size="20"
                    :class="[
                      cn(
                        'text-basic-gray-60 flex items-center justify-center transition-transform'
                      ),
                      selectedRepo?.id === repo.id ? 'rotate-90' : '',
                    ]"
                  />
                </div>
              </button>

              <div
                v-if="selectedRepo?.id === repo.id"
                :class="[
                  cn('border-t  p-4'),
                  {
                    'border-t border-divider-divider1':
                      colorMode.preference === 'light',
                    'border-t border-gray-700': colorMode.preference === 'dark',
                  },
                ]"
              >
                <BranchSelector :repository="repo" @import="handleImport" />
              </div>
            </div>

            <div v-if="filteredRepos.length === 0" class="py-12 text-center">
              <Icon
                name="ph:magnifying-glass"
                size="48"
                class="text-basic-gray-60 mx-auto mb-4"
              />
              <p class="hl-16px-600 text-basic-gray-90 mb-1">
                No repositories found
              </p>
              <p class="hl-14px-400 text-basic-gray-70">
                Try adjusting your search terms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
