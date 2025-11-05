import type { Repository } from '~/features/github/types/github'

export const useGitHubRepos = () => {
    const repositories = ref<Repository[]>([])
    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const fetchRepositories = async () => {
        isLoading.value = true
        error.value = null

        try {
            const response = await $fetch<Repository[]>('/api/github/repos')
            repositories.value = response
        } catch (err) {
            console.error('Error loading repositories:', err)
            error.value = 'Failed to load repositories. Please try again.'
            repositories.value = []
        } finally {
            isLoading.value = false
        }
    }

    return {
        repositories: readonly(repositories),
        isLoading: readonly(isLoading),
        error: readonly(error),
        fetchRepositories,
    }
}
