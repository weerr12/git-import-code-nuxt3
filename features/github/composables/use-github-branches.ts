import type { Branch } from '~/features/github/types/github'

export const useGitHubBranches = (owner: string, repo: string) => {
    const branches = ref<Branch[]>([])
    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const fetchBranches = async () => {
        isLoading.value = true
        error.value = null

        try {
            const response = await $fetch<Branch[]>(`/api/github/repos/${owner}/${repo}/branches`)
            branches.value = response
        } catch (err) {
            console.error('Error loading branches:', err)
            error.value = 'Failed to load branches'
            branches.value = []
        } finally {
            isLoading.value = false
        }
    }

    return {
        branches: readonly(branches),
        isLoading: readonly(isLoading),
        error: readonly(error),
        fetchBranches,
    }
}
