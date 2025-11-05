<script setup lang="ts">
import type { Repository, ImportState } from "~/features/github/types/github";
import GithubImportImportProgress from "~/features/github/components/import-progress.vue";
import { useImportedProjects } from "~/features/github/composables/use-imported-projects";

const githubStore = useGithubStore();
const route = useRoute();
const { addProject } = useImportedProjects();

const importState = ref<ImportState>({
  repository: null,
  branch: null,
  status: "idle",
});

const currentProjectId = ref<string | null>(null);

const checkAuthentication = async () => {
  const authenticated = route.query.authenticated;

  if (authenticated === "true") {
    await navigateTo(route.path, { replace: true });
    githubStore.setAuthenticated(true);
    githubStore.setCheckingAuth(false);
    return;
  }

  await githubStore.checkAuth();

  if (!githubStore.isAuthenticated && !githubStore.isCheckingAuth) {
    await navigateTo("/", { replace: true });
  }
};

const handleImport = (repo: Repository, branch: string) => {
  importState.value = {
    repository: repo,
    branch,
    status: "importing",
  };

  setTimeout(() => {
    importState.value.status = "success";
    const projectId = addProject(repo, branch);
    currentProjectId.value = projectId ?? null;
  }, 3000);
};

const handleReset = () => {
  importState.value = {
    repository: null,
    branch: null,
    status: "idle",
  };
  currentProjectId.value = null;
};

const handleViewProject = () => {
  if (currentProjectId.value) {
    navigateTo(`/project/${currentProjectId.value}`);
  }
};

onMounted(() => {
  checkAuthentication();
});

const currentView = computed(() => {
  if (githubStore.isCheckingAuth) return "loading";
  if (!githubStore.isAuthenticated) return "redirect";
  if (
    importState.value.status === "importing" ||
    importState.value.status === "success"
  ) {
    return "progress";
  }
  return "repository-list";
});
</script>

<template>
  <div
    v-if="currentView === 'loading'"
    class="flex h-screen items-center justify-center"
  >
    <div class="text-center">
      <Icon
        name="ph:circle-notch"
        size="32"
        class="animate-spin text-ci-primary mx-auto mb-4"
      />
      <p class="hl-14px-400 text-basic-gray-70">Checking authentication...</p>
    </div>
  </div>

  <GithubImportImportProgress
    v-else-if="currentView === 'progress'"
    :repository="importState.repository!"
    :branch="importState.branch!"
    :status="importState.status"
    @reset="handleReset"
    @view-project="handleViewProject"
  />

  <GithubImportRepositoryList v-else @import-repo="handleImport" />
</template>
