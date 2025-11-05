import { defineEventHandler, getCookie, createError } from 'h3'
import { useToken } from '~/core/composables/use-Token'
import type { Repository } from '~/features/github/types/github'

export interface GitHubRepoResponse {
    id: number
    name: string
    full_name: string
    description: string | null
    private: boolean
    updated_at: string
    default_branch: string
    owner: {
        login: string
    }
}

export default defineEventHandler(async (event) => {
    const { getToken } = useToken(event)
    const token = getToken()


    try {
        const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'git-import-nuxt',
                'X-GitHub-Api-Version': '2022-11-28',
            }
        })


        const data = await response.json() as GitHubRepoResponse[]

        return data.map((repo): Repository => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            private: repo.private,
            updated_at: repo.updated_at,
            default_branch: repo.default_branch,
        }))
    } catch (error) {
        console.error('Unexpected error fetching repositories:', error)
    }
})
