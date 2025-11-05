export const useDateFormat = () => {
    const formatRelativeTime = (dateString: string): string => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
            return diffInMinutes < 1 ? 'just now' : `${diffInMinutes} minutes ago`
        }

        if (diffInHours < 24) {
            return `${diffInHours} hours ago`
        }

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 30) {
            return `${diffInDays} days ago`
        }

        const diffInMonths = Math.floor(diffInDays / 30)
        if (diffInMonths < 12) {
            return `${diffInMonths} months ago`
        }

        const diffInYears = Math.floor(diffInMonths / 12)
        return `${diffInYears} years ago`
    }

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString()
    }

    const formatDateTime = (dateString: string): string => {
        return new Date(dateString).toLocaleString()
    }

    return {
        formatRelativeTime,
        formatDate,
        formatDateTime,
    }
}
