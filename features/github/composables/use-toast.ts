import { v4 as uuidv4 } from 'uuid'

export interface Toast {
    id?: string | number
    variant?: 'default' | 'info' | 'success' | 'warning' | 'danger'
    title?: string
    message?: string
    duration?: number
}

export function useToast() {
    const toasts = useState<Toast[]>('toast', () => [])

    function remove(toast: Toast) {
        toasts.value = toasts.value.filter((e) => e.id !== toast.id)
    }

    function add(toast: Toast) {
        toasts.value.push({
            id: uuidv4(),
            variant: 'default',
            duration: 5000,
            ...toast,
        })
    }

    function success(toast: Toast) {
        toasts.value.push({
            id: uuidv4(),
            duration: 5000,
            ...toast,
            variant: 'success',
        })
    }

    function info(toast: Toast) {
        toasts.value.push({
            id: uuidv4(),
            duration: 5000,
            ...toast,
            variant: 'info',
        })
    }

    function warning(toast: Toast) {
        toasts.value.push({
            id: uuidv4(),
            duration: 5000,
            ...toast,
            variant: 'warning',
        })
    }

    function error(toast: Toast) {
        toasts.value.push({
            id: uuidv4(),
            duration: 5000,
            ...toast,
            variant: 'danger',
        })
    }

    return {
        add,
        remove,
        info,
        warning,
        success,
        error,
    }
}
