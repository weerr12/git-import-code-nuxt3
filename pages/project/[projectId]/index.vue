<script setup lang="ts">
import { useImportedProjects } from "~/features/github/composables/use-imported-projects";
import GithubProjectView from "~/features/github/components/project-view.vue";

const route = useRoute();
const router = useRouter();
const projectId = route.params.projectId as string;

const { getProjectById } = useImportedProjects();
const project = computed(() => getProjectById(projectId));

const handleBack = () => {
  router.push("/");
};
</script>

<template>
  <div>
    <ClientOnly>
      <div v-if="project">
        <GithubProjectView
          :repository="project.repository"
          :branch="project.branch"
          @back="handleBack"
        />
      </div>
    </ClientOnly>
  </div>
</template>
