<script setup lang="ts">
const route = useRoute();
const code = route.query.code as string;

if (code) {
  navigateTo(`/api/auth/github/callback?code=${code}`, { external: true });
} else {
  navigateTo("/auth/signin");
}
</script>

<template>
  <div class="flex h-[calc(100vh-80px)] items-center justify-center">
    <div class="text-center">
      <Icon
        name="ph:circle-notch"
        size="32"
        class="animate-spin text-primary mx-auto mb-4"
      />
      <p class="text-sm text-muted-foreground">Authenticating...</p>
    </div>
  </div>
</template>
