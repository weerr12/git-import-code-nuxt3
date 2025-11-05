<script setup lang="ts">
import { useImportedProjects } from "~/features/github/composables/use-imported-projects";
import { useDateFormat } from "~/features/github/composables/use-date";

const githubStore = useGithubStore();
const { projects, removeProject } = useImportedProjects();
const { formatRelativeTime } = useDateFormat();
const searchQuery = ref<string>("");
const isClient = ref<boolean>(false);

const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value;

  const query = searchQuery.value.toLowerCase();
  return projects.value.filter(
    (project) =>
      project.repository.name.toLowerCase().includes(query) ||
      project.repository.description?.toLowerCase().includes(query) ||
      project.branch.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  isClient.value = true;
  await githubStore.checkAuth();
});

const handleImportClick = () => {
  if (githubStore.isAuthenticated) {
    navigateTo("/github-import");
  } else {
    navigateTo("/auth/signin");
  }
};

const handleRemoveProject = (projectId: string) => {
  removeProject(projectId);
};
</script>
<template>
  <div class="mx-auto w-full max-w-[978px] px-4 py-16">
    <!-- {{ projects }} -->
    <h1 class="hl-30px-600">👋 Welcome to Import github Project</h1>
    <div class="mt-12 flex items-start justify-between gap-4">
      <div class="flex-1">
        <h2 class="hl-24px-600">All Projects</h2>
        <p class="hl-16px-400 text-basic-gray-80 mt-2">
          A directory of all projects you can access.
        </p>
      </div>
      <UiButton size="regular" @click="handleImportClick">
        <Icon name="ph:plus" size="24" />
        Import Project
      </UiButton>
    </div>

    <ClientOnly>
      <div v-if="projects.length > 0" class="mt-6">
        <UiTextInput
          v-model="searchQuery"
          icon-name="ph:magnifying-glass"
          icon-position="left"
          placeholder="Search Project name, description, or branch..."
          class="w-full max-w-[400px]"
        />
      </div>

      <div v-if="filteredProjects.length > 0" class="mt-8 gap-4 flex flex-col">
        <NuxtLink
          v-for="project in filteredProjects"
          :key="project.id"
          :to="`/project/${project.id}`"
          :class="[
            cn('border group rounded-lg p-4 hover:bg-ci-primary/10', {
              'border-divider-divider1': $colorMode.preference === 'light',
              'border-gray-700': $colorMode.preference === 'dark',
            }),
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <Icon
                  name="ph:folder-simple-dashed"
                  size="20"
                  class="text-ci-primary"
                />
                <h3 class="hl-16px-600">{{ project.repository.name }}</h3>
                <UiBadge
                  :variant="
                    project.repository.private ? 'default' : 'default-solid'
                  "
                  size="sm"
                  border-radious="rounded"
                  class="flex items-center justify-center gap-1"
                >
                  <Icon
                    :name="project.repository.private ? 'ph:lock' : 'ph:globe'"
                    size="12"
                    class="mr-1"
                  />
                  {{ project.repository.private ? "Private" : "Public" }}
                </UiBadge>
              </div>

              <p
                v-if="project.repository.description"
                class="hl-14px-400 text-basic-gray-70 mb-2"
              >
                {{ project.repository.description }}
              </p>

              <div
                class="flex items-center gap-4 hl-12px-400 text-basic-gray-60"
              >
                <div class="flex items-center gap-1">
                  <Icon name="ph:git-branch" size="14" />
                  <span>{{ project.branch }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="ph:clock" size="14" />
                  <span
                    >Imported {{ formatRelativeTime(project.importedAt) }}</span
                  >
                </div>
              </div>
            </div>

            <div>
              <button
                @click.prevent="handleRemoveProject(project.id)"
                class="p-2 rounded-md flex items-center justify-center cursor-pointer hover:bg-panels-gray-1 text-basic-gray-60 hover:text-cta-danger-default opacity-0 group-hover:opacity-100"
                title="Remove project"
              >
                <Icon name="ph:trash" size="24" />
              </button>
            </div>
          </div>
        </NuxtLink>
      </div>
      <div
        v-else-if="projects.length > 0 && filteredProjects.length === 0"
        class="mt-16 flex flex-col items-center justify-center py-12"
      >
        <div class="mb-6">
          <Icon
            name="ph:magnifying-glass"
            size="80"
            class="text-basic-gray-60"
          />
        </div>
        <h3 class="hl-20px-600 text-basic-gray-90 mb-2">No Results Found</h3>
        <p class="hl-16px-400 text-basic-gray-70 mb-6 text-center">
          Try adjusting your search terms
        </p>
      </div>

      <div v-else class="mt-16 flex flex-col items-center justify-center py-12">
        <div class="mb-6">
          <Icon
            name="ph:folder-notch-open"
            size="80"
            class="text-basic-gray-60"
          />
        </div>
        <h3 class="hl-20px-600 text-basic-gray-90 mb-2">No Projects Yet!</h3>
        <p class="hl-16px-400 text-basic-gray-70 mb-6 text-center">
          Start by importing your first GitHub project to see it listed here.
        </p>
      </div>
    </ClientOnly>
  </div>
</template>
