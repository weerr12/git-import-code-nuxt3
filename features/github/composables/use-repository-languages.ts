export interface LanguageData {
    [language: string]: number
}

export interface LanguageComposition {
    language: string
    bytes: number
    percentage: number
    color: string
}

const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Vue: '#41b883',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Shell: '#89e051',
    Dockerfile: '#384d54',
    Makefile: '#427819',
    JSON: '#292929',
    YAML: '#cb171e',
    Markdown: '#083fa1',
    Other: '#ededed',
}

export const useRepositoryLanguages = () => {
    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const languages = ref<LanguageComposition[]>([])

    const fetchLanguages = async (owner: string, repo: string) => {
        if (!owner || !repo) return

        isLoading.value = true
        error.value = null

        try {
            const data = await $fetch<LanguageData>(
                `/api/github/repos/${owner}/${repo}/languages`
            )

            const totalBytes = Object.values(data).reduce((sum, bytes) => sum + bytes, 0)

            languages.value = Object.entries(data)
                .map(([language, bytes]) => ({
                    language,
                    bytes,
                    percentage: (bytes / totalBytes) * 100,
                    color: LANGUAGE_COLORS[language] || LANGUAGE_COLORS.Other,
                }))
                .sort((a, b) => b.percentage - a.percentage)

        } catch (err) {
            console.error('Error fetching languages:', err)
            error.value = 'Failed to load language data'
            languages.value = []
        } finally {
            isLoading.value = false
        }
    }

    return {
        languages: readonly(languages),
        isLoading: readonly(isLoading),
        error: readonly(error),
        fetchLanguages,
    }
}
