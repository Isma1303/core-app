/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from 'react'
import { DxInputValueChangedEvent } from '../types/dx-input-value-changed'

interface UseForm<T> {
    formState: T
    onInputChange: (event: DxInputValueChangedEvent, inputName: string) => void
    onResetForm: () => void
}

export const useForm = <T>(initialForm: T): UseForm<T> => {
    const [formState, setFormState] = useState<T>(initialForm)

    useEffect(() => {
        setFormState(initialForm)
    }, [initialForm])

    const onInputChange = useCallback((event: DxInputValueChangedEvent, inputName: string): void => {
        setFormState({
            ...formState,
            [inputName]: event.value,
        })
    }, [])

    const onResetForm = (): void => {
        setFormState(initialForm)
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
    }
}
