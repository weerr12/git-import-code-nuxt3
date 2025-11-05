<script setup lang="ts">
import ToastItem from "./toast-item.vue";
import { useToast } from "../../../features/github/composables/use-toast";

const toasts = useState<Toast[]>("toast", () => []);

const { remove } = useToast();
</script>

<template>
  <div class="fixed top-0 right-0 isolate z-[9999]">
    <TransitionGroup name="list" tag="div" class="relative pt-8 pr-8">
      <ToastItem
        v-for="item of toasts"
        :key="item.id"
        :title="item.title"
        :message="item.message"
        :variant="item.variant"
        :duration="item.duration"
        class="mb-4"
        @close="remove(item)"
      />
    </TransitionGroup>
  </div>
</template>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
