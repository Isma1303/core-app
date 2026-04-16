/* eslint-disable no-unused-vars */

import { UsersService } from '../services'
import { User } from '../interfaces'

const usersService = new UsersService()

interface Params {
    user: User
    formRef: React.RefObject<any>
    rowUpdated: (param: boolean) => void
    closePopup: (param: boolean) => void
}

interface UseUserForm {
    changePasswordBoxMode: () => void
    changeConfirmPasswordBoxMode: () => void
    onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export const useChangePasswordUserForm = (params: Params): UseUserForm => {
    const { user, rowUpdated, closePopup } = params

    const changePasswordBoxMode = (): void => {
        // Placeholder for password visibility toggle logic
    }

    const changeConfirmPasswordBoxMode = (): void => {
        // Placeholder for confirm password visibility toggle logic
    }

    const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        const userData: Record<string, any> = { ...user }

        if (!userData.user_id) return

        userData.password = btoa(userData.password)

        const userId = userData.user_id
        delete userData.user_id
        delete userData.confirmPassword

        const response = await usersService.updateRecord(userId, userData)

        if (response) {
            rowUpdated(true)
            closePopup(true)
            return
        }

        rowUpdated(false)
    }

    return {
        changePasswordBoxMode,
        changeConfirmPasswordBoxMode,
        onFormSubmit,
    }
}
