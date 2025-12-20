import { toast } from 'sonner'

export const showSuccess = (message: string) => toast.success(message, { duration: 1000 })
export const showError = (message: string) => toast.error(message, { duration: 1500 })
export const showLoading = (message: string) => toast.loading(message)
export const dismissToast = (toastId: string) => toast.dismiss(toastId)