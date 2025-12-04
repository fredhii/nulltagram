/**
 * Returns a relative time string (e.g., "2 days ago", "5 min ago")
 */
export const timeAgo = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) {
        const mins = Math.floor(seconds / 60)
        return `${mins} min${mins > 1 ? 's' : ''} ago`
    }
    if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600)
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
    }
    if (seconds < 604800) {
        const days = Math.floor(seconds / 86400)
        return `${days} day${days > 1 ? 's' : ''} ago`
    }
    if (seconds < 2592000) {
        const weeks = Math.floor(seconds / 604800)
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }

    // For older posts, show the date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
