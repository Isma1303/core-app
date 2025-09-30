/* eslint-disable no-unused-vars */
import { ValidationCallbackData } from 'devextreme/common'
import { User } from '../../interfaces'
import { Button, Form } from 'devextreme-react'
import { FormRef, Item, ValidationRule } from 'devextreme-react/cjs/form'
import { useChangePasswordUserForm } from '../../hooks'
import { useRef } from 'react'

interface Props {
    user: User
}

interface EventsProps {
    rowUpdated: (rowAffected: boolean) => void
    closePopup: (close: boolean) => void
}

export const UserChangePasswordForm = (props: Props & EventsProps): JSX.Element => {
    const user = { ...props.user }
    const formRef = useRef<FormRef>(null)
    const { changePasswordBoxMode, changeConfirmPasswordBoxMode, onFormSubmit } = useChangePasswordUserForm({
        user,
        formRef,
        rowUpdated: props.rowUpdated,
        closePopup: props.closePopup,
    })

    const passwordConfirm = (eventoValidacionPassword: ValidationCallbackData): boolean => {
        if (user.password) return true

        return eventoValidacionPassword.value === user.password
    }

    return (
        <form onSubmit={onFormSubmit}>
            <Form ref={formRef} formData={user} colCount={1} validationGroup="formUsers">
                <Item itemType="group">
                    <Item
                        dataField="password"
                        label={{
                            text: 'Contraseña',
                        }}
                        editorType="dxTextBox"
                        editorOptions={{
                            mode: 'password',
                            placeholder: 'Contraseña',
                            buttons: [
                                {
                                    location: 'after',
                                    name: 'password',
                                    options: {
                                        icon: 'eyeopen',
                                        stylingMode: 'text',
                                        onClick: () => {
                                            changePasswordBoxMode()
                                        },
                                    },
                                },
                            ],
                        }}
                    >
                        <ValidationRule type="required" message="La contraseña es requerida" />
                        <ValidationRule
                            type="pattern"
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})"
                            message="La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial"
                        />
                    </Item>

                    <Item
                        dataField="confirmPassword"
                        label={{
                            text: 'Confirmar Contraseña',
                        }}
                        editorType="dxTextBox"
                        editorOptions={{
                            mode: 'password',
                            placeholder: 'Confirmar Contraseña',
                            buttons: [
                                {
                                    location: 'after',
                                    name: 'confirmPassword',
                                    options: {
                                        icon: 'eyeopen',
                                        stylingMode: 'text',
                                        onClick: () => {
                                            changeConfirmPasswordBoxMode()
                                        },
                                    },
                                },
                            ],
                        }}
                    >
                        <ValidationRule type="custom" validationCallback={passwordConfirm} message="Las contraseñas no coinciden" />
                    </Item>
                </Item>

                <Item>
                    <Button width="100%" type="default" text="guardar" useSubmitBehavior={true} validationGroup="formUsers" />
                </Item>
            </Form>
        </form>
    )
}
