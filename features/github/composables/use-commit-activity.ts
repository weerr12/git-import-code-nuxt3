export interface CommitActivity {
    days: number[]
    total: number
    week: number
}

export interface DayActivity {
    date: Date
    count: number
    weekIndex: number
    dayIndex: number
}

export function useCommitActivity(owner: string, repo: string) {
    const activities = ref<CommitActivity[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const fetchCommitActivity = async () => {
        isLoading.value = true
        error.value = null

        try {
            const data = await $fetch<CommitActivity[]>(`/api/github/repos/${owner}/${repo}/stats/commit_activity`)
            activities.value = data || []
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch commit activity'
            activities.value = []
        } finally {
            isLoading.value = false
        }
    }

    const heatmapData = computed<DayActivity[]>(() => {
        if (!activities.value.length) return []

        const data: DayActivity[] = []

        activities.value.forEach((week, weekIndex) => {
            week.days.forEach((count, dayIndex) => {
                const date = new Date(week.week * 1000)
                date.setDate(date.getDate() + dayIndex)

                data.push({
                    date,
                    count,
                    weekIndex,
                    dayIndex
                })
            })
        })

        return data
    })

    const stats = computed(() => {
        if (!activities.value.length) {
            return {
                totalCommits: 0,
                averagePerWeek: 0,
                maxCommitsInDay: 0,
                mostActiveDay: null as Date | null
            }
        }

        const totalCommits = activities.value.reduce((sum, week) => sum + week.total, 0)
        const allDays = heatmapData.value
        const maxCommitsInDay = Math.max(...allDays.map(d => d.count))
        const mostActiveDay = allDays.find(d => d.count === maxCommitsInDay)

        return {
            totalCommits,
            averagePerWeek: Math.round(totalCommits / activities.value.length),
            maxCommitsInDay,
            mostActiveDay: mostActiveDay?.date || null
        }
    })

    return {
        activities: readonly(activities),
        heatmapData,
        stats,
        isLoading: readonly(isLoading),
        error: readonly(error),
        fetchCommitActivity
    }
}
