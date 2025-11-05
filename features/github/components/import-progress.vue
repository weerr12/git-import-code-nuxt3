<script setup lang="ts">
import type { Repository } from "~/features/github/types/github";
import { useToast } from "../composables/use-toast";

const props = defineProps<{
  repository: Repository;
  branch: string;
  status: "idle" | "importing" | "success" | "error";
}>();

const emit = defineEmits<{
  (e: "reset"): void;
  (e: "view-project"): void;
}>();

const toast = useToast();
const colorMode = useColorMode();

const handleReset = () => {
  emit("reset");
};

const handleViewProject = () => {
  emit("view-project");
};

watch(
  () => props.status,
  (newStatus, oldStatus) => {
    if (newStatus === "success" && oldStatus === "importing") {
      toast.success({
        title: "Import Successful!",
        message: `${props.repository.name} has been successfully imported.`,
        duration: 5000,
      });
    } else if (newStatus === "error" && oldStatus === "importing") {
      toast.error({
        title: "Import Failed",
        message: `Failed to import ${props.repository.name}. Please try again.`,
        duration: 7000,
      });
    }
  }
);
</script>

<template>
  <div class="flex h-screen items-center justify-center p-4">
    <div
      :class="[
        cn('border w-full max-w-[512px] rounded-lg'),
        {
          'border-divider-divider1': colorMode.preference === 'light',
          'border-gray-700': colorMode.preference === 'dark',
        },
      ]"
    >
      <div
        class="border-b border-divider-divider1 px-6 py-4"
        :class="[
          cn('border-b '),
          {
            'bg-panels-white border-input-field-border-default text-gray-900':
              colorMode.preference === 'light',
            'bg-gray-800 text-white border-gray-700':
              colorMode.preference === 'dark',
          },
        ]"
      >
        <h2 class="text-center hl-24px-600">
          <span v-if="status === 'importing'">Importing Repository</span>
          <span v-else-if="status === 'success'">Import Successful</span>
          <span v-else>Import Failed</span>
        </h2>
      </div>

      <div class="flex flex-col gap-6 px-6 py-6">
        <div class="flex justify-center">
          <div
            v-if="status === 'importing'"
            class="flex h-20 w-20 items-center justify-center rounded-full bg-ci-primary/10"
          >
            <Icon
              name="ph:circle-notch"
              size="40"
              class="animate-spin text-ci-primary"
            />
          </div>
          <div
            v-else-if="status === 'success'"
            class="flex h-20 w-20 items-center justify-center rounded-full bg-cta-success-default/10"
          >
            <Icon
              name="ph:check-circle"
              size="40"
              class="text-cta-success-default"
            />
          </div>
        </div>

        <div
          :class="[
            cn('flex flex-col gap-4 rounded-lg border p-4'),
            {
              'bg-panels-white border-input-field-border-default text-gray-900':
                colorMode.preference === 'light',
              'bg-gray-800 text-white border-gray-700':
                colorMode.preference === 'dark',
            },
          ]"
        >
          <div class="flex items-start gap-3">
            <Icon
              name="ph:folder-simple-dashed"
              size="20"
              class="mt-0.5 text-basic-gray-60"
            />
            <div class="flex-1">
              <p class="hl-14px-600">Repository</p>
              <p class="hl-14px-400 text-basic-gray-70">
                {{ repository.full_name }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Icon
              name="ph:git-branch"
              size="20"
              class="mt-0.5 text-basic-gray-60"
            />
            <div class="flex-1">
              <p class="hl-14px-600">Branch</p>
              <p class="hl-14px-400 text-basic-gray-70">
                {{ branch }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="status === 'importing'" class="space-y-3">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="hl-14px-400 text-basic-gray-70"
                >Cloning repository...</span
              >
              <span
                class="inline-flex items-center rounded-full px-2.5 py-0.5 hl-12px-400 text-basic-gray-70"
              >
                In Progress
              </span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-panels-gray-1">
              <div class="h-full w-2/3 animate-pulse bg-ci-primary" />
            </div>
          </div>
          <p class="text-center hl-12px-400 text-basic-gray-60">
            This may take a few moments
          </p>
        </div>

        <div v-else-if="status === 'success'" class="flex flex-col gap-4">
          <div class="rounded-lg bg-cta-success-default/10 p-4 text-center">
            <p class="hl-14px-600 text-cta-success-default">
              Your repository has been successfully imported!
            </p>
          </div>
          <div class="flex gap-2">
            <UiButton
              variant="secondary"
              @click="handleReset"
              :class="[
                cn('flex-1'),
                {
                  'bg-panels-white border-input-field-border-default text-gray-900':
                    colorMode.preference === 'light',
                  'bg-gray-800 text-white border-gray-700':
                    colorMode.preference === 'dark',
                },
              ]"
            >
              Import Another
            </UiButton>
            <UiButton
              variant="primary"
              class="flex-1"
              @click="handleViewProject"
            >
              View Project
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
