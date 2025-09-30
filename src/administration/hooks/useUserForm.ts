/* eslint-disable no-unused-vars */

import { UsersService } from '../services'
import { useCallback } from 'react'
import { User } from '../interfaces'
import { FormRef } from 'devextreme-react/cjs/form'

const usersService = new UsersService()

interface Params {
    user: User
    formRef: React.RefObject<FormRef>
    rowUpdated: (param: boolean) => void
    closePopup: (param: boolean) => void
}

interface UseUserForm {
    changePasswordBoxMode: () => void
    changeConfirmPasswordBoxMode: () => void
    onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export const useUserForm = (params: Params): UseUserForm => {
    const { user, formRef, rowUpdated, closePopup } = params

    const changePasswordMode = useCallback((name: string) => {
        const editor = formRef.current?.instance().getEditor(name)
        editor?.option('mode', editor.option('mode') === 'text' ? 'password' : 'text')
    }, [])

    const changePasswordBoxMode = (): void => {
        changePasswordMode('password')
    }

    const changeConfirmPasswordBoxMode = (): void => {
        changePasswordMode('confirmPassword')
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
