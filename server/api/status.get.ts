import { defineEventHandler, getCookie } from 'h3'
import { useToken } from '~/core/composables/use-Token'

export interface AuthStatusResponse {
    authenticated: boolean
}

export default defineEventHandler((event): AuthStatusResponse => {
    const { getToken } = useToken(event)
    const token = getToken()
    return {
        authenticated: Boolean(token)
    }
})
