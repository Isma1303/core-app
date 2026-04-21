import { toast } from 'sonner'

const showErrorMessage = (message: string) => {
    toast.error(message)
    console.error(message)
}

export { showErrorMessage }
