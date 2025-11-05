<script setup lang="ts">
// Types & Composables
import type { Repository } from "~/features/github/types/github";
import { useFileTree } from "../composables/use-file-tree";
import { useFileViewer } from "../composables/use-file-viewer";

// Utils
import {
  parseRepoFullName,
  getGitHubZipUrl,
  getGitHubRepoUrl,
  downloadFile,
  openInNewTab,
} from "../utils/github";

import ProjectHeader from "./project-header.vue";
import FileTreeView from "./file-tree-view.vue";
import ProjectActions from "./project-actions.vue";
import FileViewer from "./file-viewer.vue";
import BranchCompareModal from "./branch-model.vue";
import LanguageCompositionChart from "./language-chart.vue";
import LanguageStats from "./language-stats.vue";
import CommitFrequencyHeatmap from "./heatmap.vue";
import TopContributors from "./top-contributors.vue";
import ContributorCommitDensity from "./contributor-commit.vue";

const props = defineProps<{
  repository: Repository;
  branch: string;
}>();

const emit = defineEmits<{ (e: "back"): void }>();

const route = useRoute();
const projectId = route.params.projectId as string;
const { owner, repo } = parseRepoFullName(props.repository.full_name);

const showCompareModal = ref(false);
const { branches, fetchBranches } = useGitHubBranches(owner, repo);

const {
  selectedFile,
  highlightedCode,
  loading: fileLoading,
  error: fileError,
  fetchFileContent,
  closeFileViewer,
} = useFileViewer({
  owner,
  repo,
  branch: props.branch,
});

const { fileStructure, loading, error, loadFileStructure, handleItemClick } =
  useFileTree({
    owner,
    repo,
    branch: props.branch,
    onFileClick: fetchFileContent,
  });

const downloadZip = () =>
  downloadFile(
    getGitHubZipUrl(props.repository.full_name, props.branch),
    `${props.repository.name}-${props.branch}.zip`
  );
const openGitHub = () =>
  openInNewTab(getGitHubRepoUrl(props.repository.full_name));

onMounted(() => {
  loadFileStructure();
  fetchBranches();
});
</script>

<template>
  <div class="p-8">
    <div class="mx-auto max-w-7xl w-full flex flex-col gap-6">
      <ProjectHeader
        :repository="repository"
        :branch="branch"
        @back="emit('back')"
        @compare="showCompareModal = true"
      />

      <div
        class="grid gap-6"
        :class="selectedFile ? 'grid-cols-2' : 'grid-cols-1'"
      >
        <FileTreeView
          :items="fileStructure"
          :loading="loading"
          :error="error"
          :selected-file="selectedFile"
          @item-click="handleItemClick"
        />

        <FileViewer
          v-if="selectedFile"
          :file="selectedFile"
          :highlighted-code="highlightedCode"
          :loading="fileLoading"
          :error="fileError"
          @close="closeFileViewer"
        />
      </div>

      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2">
          <LanguageCompositionChart :owner="owner" :repo="repo" />
        </div>
        <LanguageStats :owner="owner" :repo="repo" />
      </div>

      <CommitFrequencyHeatmap :owner="owner" :repo="repo" />

      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2">
          <ContributorCommitDensity :owner="owner" :repo="repo" />
        </div>
        <TopContributors :owner="owner" :repo="repo" />
      </div>
      <ProjectActions @open-github="openGitHub" @download-zip="downloadZip" />
    </div>

    <BranchCompareModal
      :is-open="showCompareModal"
      :project-id="projectId"
      :branches="[...branches]"
      :default-branch="branch"
      @close="showCompareModal = false"
    />
  </div>
</template>
