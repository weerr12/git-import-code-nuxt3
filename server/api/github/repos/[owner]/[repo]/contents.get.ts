import { defineEventHandler, getCookie, createError, getQuery } from 'h3'
import { useToken } from '~/core/composables/use-Token'


export default defineEventHandler(async (event) => {
    const { getToken } = useToken(event)
    const token = getToken()

    const { owner, repo } = event.context.params as { owner: string; repo: string }
    const query = getQuery(event)
    const ref = query.ref as string | undefined
    const path = query.path as string | undefined

    try {
        let apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`

        if (path) {
            apiUrl += `/${path}`
        }

        if (ref) {
            apiUrl += `?ref=${ref}`
        }

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'git-import-nuxt',
                'X-GitHub-Api-Version': '2022-11-28',
            }
        })

        const data = await response.json()

        return Array.isArray(data) ? data : [data]
    } catch (error: any) {
        console.error('Error fetching repository contents:', error)
    }
})
