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

export const useUserForm = (params: Params): UseUserForm => {
    const { user, rowUpdated, closePopup } = params

    const changePasswordBoxMode = (): void => {
        // Placeholder for password visibility toggle
    }

    const changeConfirmPasswordBoxMode = (): void => {
        // Placeholder for confirm password visibility toggle
    }

    const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        const userData: Record<string, any> = { ...user }

        for (const k in userData) {
            if (!userData[k]) delete userData[k]
        }

        if (!userData.user_id) {
            delete userData.user_id
            delete userData.confirmPassword

            const response = await usersService.createRecord(userData as User)

            if (response) {
                rowUpdated(true)
                closePopup(true)
            } else {
                rowUpdated(false)
            }
        } else {
            const userId = userData.user_id
            delete userData.user_id
            delete userData.password
            delete userData.confirmPassword

            const response = await usersService.updateRecord(userId, userData)

            if (response) {
                rowUpdated(true)
                closePopup(true)
            } else {
                rowUpdated(false)
            }
        }
    }

    return {
        changePasswordBoxMode,
        changeConfirmPasswordBoxMode,
        onFormSubmit,
    }
}
