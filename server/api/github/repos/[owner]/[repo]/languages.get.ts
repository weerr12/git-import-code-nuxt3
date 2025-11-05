import { defineEventHandler } from 'h3'
import { useToken } from '~/core/composables/use-Token'


export default defineEventHandler(async (event) => {
    const { getToken } = useToken(event)
    const token = getToken()

    const { owner, repo } = event.context.params as { owner: string; repo: string }

    try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/languages`

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'git-import-nuxt',
                'X-GitHub-Api-Version': '2022-11-28',
            }
        })

        const data = await response.json()
        return data
    } catch (error: any) {
        console.error('Error fetching repository languages:', error)
    }
})
