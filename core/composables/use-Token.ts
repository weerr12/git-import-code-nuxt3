import { setCookie, getCookie } from 'h3'
import type { H3Event } from 'h3'

export interface TokenOptions {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
    maxAge?: number
    path?: string
}

export function useToken(event: H3Event) {
    const config = useRuntimeConfig()
    const isProd = config?.public?.nodeEnv === 'production' || process.env.NODE_ENV === 'production'

    const defaultOpts: TokenOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
    }

    function setToken(token: string, opts?: TokenOptions) {
        setCookie(event, 'github_token', token, { ...defaultOpts, ...opts })
    }

    function getToken() {
        return getCookie(event, 'github_token')
    }

    function clearToken() {
        setCookie(event, 'github_token', '', { ...defaultOpts, maxAge: 0 })
    }

    function setOauthState(stateValue: string) {
        setCookie(event, 'oauth_state', stateValue, { path: '/', maxAge: 60 * 10 })
    }

    function clearOauthState() {
        setCookie(event, 'oauth_state', '', { path: '/', maxAge: 0 })
    }
    return {
        setToken,
        getToken,
        clearToken,
        setOauthState,
        clearOauthState,
    }
}