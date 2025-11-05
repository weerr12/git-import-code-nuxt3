import { defineEventHandler } from 'h3'
import { useToken } from '~/core/composables/use-Token'

export default defineEventHandler((event) => {
    const { clearToken } = useToken(event)
    clearToken()


    return {
        success: true,
        message: 'Logged out successfully'
    }
})
