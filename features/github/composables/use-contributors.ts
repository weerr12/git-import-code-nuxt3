export interface SimpleContributor {
    login: string
    avatar_url: string
    html_url: string
    contributions: number
}

export interface ContributorWeekStat {
    w: number // unix timestamp for week start
    a: number // additions
    d: number // deletions
    c: number // commits
}

export interface ContributorStatsItem {
    author: {
        login: string
        avatar_url: string
        html_url: string
    } | null
    total: number
    weeks: ContributorWeekStat[]
}

export function useContributors(owner: string, repo: string) {
    const list = ref<SimpleContributor[]>([])
    const stats = ref<ContributorStatsItem[]>([])
    const isLoadingList = ref(false)
    const isLoadingStats = ref(false)
    const errorList = ref<string | null>(null)
    const errorStats = ref<string | null>(null)

    const fetchContributors = async () => {
        isLoadingList.value = true
        errorList.value = null
        try {
            const data = await $fetch<SimpleContributor[]>(`/api/github/repos/${owner}/${repo}/contributors`)
            list.value = data || []
        } catch (e: any) {
            errorList.value = e?.message || 'Failed to fetch contributors'
            list.value = []
        } finally {
            isLoadingList.value = false
        }
    }

    const fetchContributorStats = async () => {
        isLoadingStats.value = true
        errorStats.value = null
        try {
            const data = await $fetch<any>(`/api/github/repos/${owner}/${repo}/stats/contributors`)
            if (Array.isArray(data)) {
                stats.value = data as ContributorStatsItem[]
            } else {
                stats.value = []
            }
        } catch (e: any) {
            errorStats.value = e?.message || 'Failed to fetch contributor stats'
            stats.value = []
        } finally {
            isLoadingStats.value = false
        }
    }

    const topContributors = computed(() => {
        const sorted = [...list.value].sort((a, b) => b.contributions - a.contributions)
        const total = sorted.reduce((s, v) => s + v.contributions, 0)
        return sorted.slice(0, 10).map(c => ({
            ...c,
            percentage: total ? +(c.contributions * 100 / total).toFixed(1) : 0
        }))
    })

    const monthlyDensity = computed(() => {
        if (!stats.value.length) return { months: [] as string[], series: [] as { name: string, data: number[] }[] }

        const now = new Date()
        const months: string[] = []
        const monthKeys: string[] = []
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            monthKeys.push(key)
            months.push(d.toLocaleDateString('en-US', { month: 'short' }))
        }

        const top = [...stats.value]
            .filter(s => s.author)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)

        const authorSeries = top.map(s => ({ name: s.author!.login, data: new Array(months.length).fill(0) }))

        top.forEach((s, idx) => {
            s.weeks.forEach(w => {
                if (w.c <= 0) return
                const date = new Date(w.w * 1000)
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                const kIndex = monthKeys.indexOf(key)
                if (kIndex !== -1) {
                    authorSeries[idx].data[kIndex] += w.c
                }
            })
        })

        return { months, series: authorSeries }
    })

    return {
        list: readonly(list),
        stats: readonly(stats),
        topContributors,
        monthlyDensity,
        isLoadingList: readonly(isLoadingList),
        isLoadingStats: readonly(isLoadingStats),
        errorList: readonly(errorList),
        errorStats: readonly(errorStats),
        fetchContributors,
        fetchContributorStats,
    }
}
