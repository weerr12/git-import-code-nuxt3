import { defineEventHandler, getQuery, sendError, H3Event } from 'h3'
import { useToken } from '~/core/composables/use-Token'

export default defineEventHandler(async (event: H3Event) => {
    const { getToken } = useToken(event)
    const token = getToken()

    try {
        const query = getQuery(event)
        const fields = (query.fields as string | undefined)?.split(',').map(s => s.trim())

        const githubRes = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        })

        const profile = await githubRes.json()

        if (fields && fields.length > 0) {
            const filtered: Record<string, any> = {}
            for (const f of fields) {
                if (f in profile) filtered[f] = profile[f]
            }
            return filtered
        }

        return profile
    } catch (err) {
        return sendError(event, createError({ statusCode: 500, statusMessage: 'Failed to fetch GitHub profile' }))
    }
})
