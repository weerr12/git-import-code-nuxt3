<script setup lang="ts">
import { useImportedProjects } from "~/features/github/composables/use-imported-projects";
import type { GitHubContent } from "~/features/github/types/github";

const route = useRoute();
const router = useRouter();
const colorMode = useColorMode();

const projectId = route.params.projectId as string;
const baseBranch = route.query.base as string;
const compareBranch = route.query.compare as string;

const { getProjectById } = useImportedProjects();
const project = computed(() => getProjectById(projectId));
const owner = computed(
  () => project.value?.repository.full_name.split("/")[0] || ""
);
const repo = computed(
  () => project.value?.repository.full_name.split("/")[1] || ""
);

const items = ref<GitHubContent[]>([]);
const selectedFile = ref<GitHubContent | null>(null);
const currentPath = ref("");
const breadcrumbs = computed(() =>
  currentPath.value ? currentPath.value.split("/") : []
);

const isLoadingFiles = ref(false);
const errorFiles = ref("");

const baseContent = ref("");
const compareContent = ref("");
const isLoadingContent = ref(false);
const errorContent = ref("");

const decodeContent = (content?: string) => {
  if (!content) return "";
  return atob(content.replace(/\n/g, ""));
};
const fetchContent = async (path: string, ref: string) => {
  const response = await $fetch<GitHubContent[]>(
    `/api/github/repos/${owner.value}/${repo.value}/contents`,
    { params: { path, ref } }
  );
  return Array.isArray(response) ? response[0] : response;
};

const fetchFileList = async (path = "") => {
  if (!owner.value || !repo.value) return;

  isLoadingFiles.value = true;
  errorFiles.value = "";

  try {
    items.value = await $fetch<GitHubContent[]>(
      `/api/github/repos/${owner.value}/${repo.value}/contents`,
      { params: { ref: baseBranch, path: path || undefined } }
    );
    currentPath.value = path;
  } catch (err) {
    console.error("Error fetching files:", err);
    errorFiles.value = "Failed to load files";
  } finally {
    isLoadingFiles.value = false;
  }
};

const fetchFileContents = async (filePath: string) => {
  if (!owner.value || !repo.value) return;

  isLoadingContent.value = true;
  errorContent.value = "";
  baseContent.value = "";
  compareContent.value = "";

  try {
    const [baseFile, compareFile] = await Promise.all([
      fetchContent(filePath, baseBranch),
      fetchContent(filePath, compareBranch),
    ]);

    baseContent.value = decodeContent(baseFile.content);
    compareContent.value = decodeContent(compareFile.content);
  } catch (err) {
    console.error("Error fetching file contents:", err);
    errorContent.value = "Failed to load file contents";
  } finally {
    isLoadingContent.value = false;
  }
};

const handleItemClick = async (item: GitHubContent) => {
  if (item.type === "file") {
    selectedFile.value = item;
    await fetchFileContents(item.path);
  } else {
    selectedFile.value = null;
    await fetchFileList(item.path);
  }
};

const navigateTo = async (index: number) => {
  const path =
    index === -1 ? "" : breadcrumbs.value.slice(0, index + 1).join("/");
  selectedFile.value = null;
  await fetchFileList(path);
};

const goBack = () => router.push(`/project/${projectId}`);

const isDark = computed(() => colorMode.preference === "dark");
const cardClass = computed(() =>
  cn("rounded-lg border p-4", {
    "bg-white border-divider-divider1": !isDark.value,
    "bg-gray-800 border-gray-700": isDark.value,
  })
);
const contentBoxClass = computed(() =>
  cn("rounded-lg border", {
    "bg-white border-gray-200": !isDark.value,
    "bg-gray-800 border-gray-700": isDark.value,
  })
);
const codeClass = computed(() =>
  cn("text-sm overflow-auto max-h-[600px] p-4 rounded", {
    "bg-gray-50 text-gray-900": !isDark.value,
    "bg-gray-900 text-gray-100": isDark.value,
  })
);

onMounted(() => {
  if (!baseBranch || !compareBranch) {
    router.push(`/project/${projectId}`);
    return;
  }
  fetchFileList();
});
</script>

<template>
  <div class="p-8">
    <div class="mx-auto max-w-[1280px] w-full flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <button
          @click="goBack"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-panels-gray-1 transition-colors"
          aria-label="Go back"
        >
          <Icon name="ph:arrow-left" size="24" />
        </button>

        <div class="flex-1">
          <h1 class="hl-24px-600">Compare Branches</h1>
          <p class="hl-14px-400 text-basic-gray-70">
            {{ project?.repository.name }}
          </p>
        </div>
      </div>

      <div :class="cardClass">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <Icon name="ph:git-branch" size="20" class="text-ci-primary" />
            <span class="hl-14px-600">{{ baseBranch }}</span>
          </div>
          <Icon name="ph:arrow-right" size="20" class="text-basic-gray-60" />
          <div class="flex items-center gap-2">
            <Icon name="ph:git-branch" size="20" class="text-ci-primary" />
            <span class="hl-14px-600">{{ compareBranch }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <UiLabel>Browse Files and Folders</UiLabel>

        <div
          v-if="breadcrumbs.length > 0"
          :class="cn('flex items-center gap-2 px-3 py-2', cardClass)"
        >
          <button
            @click="navigateTo(-1)"
            class="flex items-center gap-1 hover:text-ci-primary transition-colors"
          >
            <Icon name="ph:house" size="16" />
            <span>Root</span>
          </button>
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <Icon name="ph:caret-right" size="12" class="text-basic-gray-60" />
            <button
              @click="navigateTo(index)"
              class="hover:text-ci-primary transition-colors"
              :class="{
                'text-ci-primary hl-14px-600': index === breadcrumbs.length - 1,
              }"
            >
              {{ crumb }}
            </button>
          </template>
        </div>

        <div :class="cn('overflow-hidden', cardClass)">
          <div
            v-if="isLoadingFiles"
            class="flex items-center justify-center py-12"
          >
            <Icon
              name="ph:circle-notch"
              size="32"
              class="animate-spin text-ci-primary"
            />
          </div>

          <div
            v-else-if="errorFiles"
            class="flex items-center justify-center py-12"
          >
            <p class="text-red-500">{{ errorFiles }}</p>
          </div>

          <div
            v-else
            class="divide-y"
            :class="isDark ? 'divide-gray-700' : 'divide-gray-200'"
          >
            <button
              v-for="item in items"
              :key="item.path"
              @click="handleItemClick(item)"
              :class="[
                cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hl-14px-400',
                  {
                    'hover:bg-gray-50': !isDark,
                    'hover:bg-gray-700': isDark,
                    'bg-ci-primary/10 border border-ci-primary':
                      selectedFile?.path === item.path,
                  }
                ),
              ]"
            >
              <Icon
                :name="item.type === 'dir' ? 'ph:folder' : 'ph:file-code'"
                size="20"
              />
              <span
                class="flex-1 truncate"
                :class="{ 'hl-14px-600': selectedFile?.path === item.path }"
              >
                {{ item.name }}
              </span>
              <Icon
                v-if="item.type === 'dir'"
                name="ph:caret-right"
                size="16"
                class="text-basic-gray-60"
              />
            </button>
          </div>
        </div>

        <UiHelper v-if="errorFiles" variant="error">{{ errorFiles }}</UiHelper>
      </div>

      <div v-if="selectedFile" class="grid grid-cols-2 gap-4">
        <div :class="contentBoxClass">
          <div
            :class="[
              cn(
                'border-b px-4 py-3',
                isDark ? 'border-gray-700' : 'border-gray-200'
              ),
            ]"
          >
            <div class="flex items-center gap-2">
              <Icon name="ph:git-branch" size="18" class="text-ci-primary" />
              <span class="hl-14px-600">{{ baseBranch }}</span>
            </div>
          </div>
          <div class="p-4">
            <div
              v-if="isLoadingContent"
              class="flex items-center justify-center py-12"
            >
              <Icon
                name="ph:circle-notch"
                size="32"
                class="animate-spin text-ci-primary"
              />
            </div>
            <div
              v-else-if="errorContent"
              class="flex items-center justify-center py-12"
            >
              <p class="text-red-500">{{ errorContent }}</p>
            </div>
            <pre v-else :class="codeClass"><code>{{ baseContent }}</code></pre>
          </div>
        </div>

        <div :class="contentBoxClass">
          <div
            :class="[
              cn(
                'border-b px-4 py-3',
                isDark ? 'border-gray-700' : 'border-gray-200'
              ),
            ]"
          >
            <div class="flex items-center gap-2">
              <Icon name="ph:git-branch" size="18" class="text-ci-primary" />
              <span class="hl-14px-600">{{ compareBranch }}</span>
            </div>
          </div>
          <div class="p-4">
            <div
              v-if="isLoadingContent"
              class="flex items-center justify-center py-12"
            >
              <Icon
                name="ph:circle-notch"
                size="32"
                class="animate-spin text-ci-primary"
              />
            </div>
            <div
              v-else-if="errorContent"
              class="flex items-center justify-center py-12"
            >
              <p class="text-red-500">{{ errorContent }}</p>
            </div>
            <pre
              v-else
              :class="codeClass"
            ><code>{{ compareContent }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
