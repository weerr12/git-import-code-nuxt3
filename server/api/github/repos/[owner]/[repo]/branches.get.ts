import { defineEventHandler, getCookie, createError } from 'h3'
import type { Branch } from '~/features/github/types/github'
import { useToken } from '~/core/composables/use-Token'

export interface GitHubBranchResponse {
    name: string
    protected: boolean
    commit: {
        sha: string
        url: string
    }
}

export default defineEventHandler(async (event) => {
    const { getToken } = useToken(event)
    const token = getToken()

    const { owner, repo } = event.context.params as { owner: string; repo: string }

    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`,
            {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${token}`,
                    'User-Agent': 'git-import-nuxt',
                    'X-GitHub-Api-Version': '2022-11-28',
                }
            }
        )

        const data = await response.json() as GitHubBranchResponse[]

        return data.map((branch): Branch => ({
            name: branch.name,
            protected: branch.protected,
        }))
    } catch (error) {
        console.error('Unexpected error fetching branches:', error)
    }
})
