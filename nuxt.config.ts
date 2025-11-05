import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    public: {
      nodeEnv: process.env.NODE_ENV || 'production',
      baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
      githubClientId: process.env.GITHUB_CLIENT_ID,
    },
  },
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  css: [
    '@/assets/css/main.css',
  ],
  components: [
    { path: '~/core/components', prefix: 'Ui' },
    { path: '~/features/github/components', prefix: 'GithubImport' }
  ],
  imports: {
    dirs: [
      'core/**',
      'features/**/composables',
      'features/**/utils',
      'features/**/types'
    ]
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    'nuxt-auth-utils',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ]
})