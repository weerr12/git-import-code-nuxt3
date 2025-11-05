import type { Me } from '~/features/github/types/github'

export const useGithubStore = defineStore('github-store', () => {
    const config = useRuntimeConfig()
    const isAuthenticated = ref<boolean>(false)
    const isCheckingAuth = ref<boolean>(false)
    const user = ref<Me | null>(null)

    const checkAuth = async () => {
        isCheckingAuth.value = true

        try {
            const response = await $fetch<{ authenticated: boolean }>('/api/status')

            isAuthenticated.value = response.authenticated

            if (response.authenticated && !user.value) {
                await fetchProfile()
            }
        } catch (error) {
            isAuthenticated.value = false
        } finally {
            isCheckingAuth.value = false
        }
    }

    const fetchProfile = async () => {
        try {
            const profile = await $fetch<Me>('/api/auth/github/profile')
            user.value = profile
        } catch (error) {
            console.error('ดึงข้อมูลโปรไฟล์ไม่สำเร็จ : ', error)
            user.value = null
        }
    }

    const login = () => {
        const baseUrl = config.public.baseUrl
        const redirectUrl = `${baseUrl}/auth/github/callback`
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.public.githubClientId}&redirect_uri=${redirectUrl}`

        if (import.meta.client) {
            window.location.href = githubAuthUrl
        }
    }

    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', { method: 'POST' })
        } catch (error) {
            console.error('Logout error:', error)
        }
        isAuthenticated.value = false
        user.value = null
    }

    const setAuthenticated = (value: boolean) => {
        isAuthenticated.value = value
    }

    const setCheckingAuth = (value: boolean) => {
        isCheckingAuth.value = value
    }

    return {
        isAuthenticated,
        isCheckingAuth,
        user,
        checkAuth,
        fetchProfile,
        login,
        logout,
        setAuthenticated,
        setCheckingAuth,
    }
})