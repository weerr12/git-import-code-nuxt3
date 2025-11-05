import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import type { GitHubTokenResponse } from '~/features/github/types/github'
import { useToken } from '~/core/composables/use-Token'

export default defineEventHandler(async (event) => {
    const { code } = getQuery(event)
    const config = useRuntimeConfig(event)
    const appUrl = config.public.baseUrl
    const clientId = config.githubClientId
    const clientSecret = config.githubClientSecret

    if (!code) {
        return sendRedirect(event, `${appUrl}/auth/signin?error=no_code`, 302)
    }

    try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
            }),
        })

        const tokenData = await tokenResponse.json() as GitHubTokenResponse

        if (tokenData.error) {
            console.error('GitHub OAuth error:', tokenData.error, tokenData.error_description)
            return sendRedirect(event, `${appUrl}/auth/signin?error=${tokenData.error}`, 302)
        }

        if (!tokenData.access_token) {
            throw new Error('No access token received from GitHub')
        }

        const { setToken, clearOauthState } = useToken(event)
        setToken(tokenData.access_token, {
            maxAge: 60 * 60 * 24,
        })

        clearOauthState()

        return sendRedirect(event, `${appUrl}/github-import?authenticated=true`, 302)
    } catch (error) {
        console.error('GitHub token exchange failed:', error)
        return sendRedirect(event, `${appUrl}/auth/signin?error=token_exchange_failed`, 302)
    }
})
