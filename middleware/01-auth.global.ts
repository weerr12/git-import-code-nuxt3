import { useGithubStore } from "~/core/store/github-store";

export default defineNuxtRouteMiddleware(async (to) => {
    const githubStore = useGithubStore();

    if (!githubStore.isCheckingAuth) {
        await githubStore.checkAuth();
    }

    const publicPages = ['/auth/signin', '/auth/github/callback'];
    const isPublicPage = publicPages.includes(to.path);

    if (githubStore.isAuthenticated && isPublicPage) {
        return navigateTo('/');
    }

    if (!githubStore.isAuthenticated && !isPublicPage) {
        return navigateTo('/auth/signin');
    }
});
