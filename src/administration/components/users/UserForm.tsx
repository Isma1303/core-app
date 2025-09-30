/* eslint-disable no-unused-vars */
import { Button, Form } from 'devextreme-react'
import { User } from '../../interfaces'
import { FormRef, Item, ValidationRule } from 'devextreme-react/cjs/form'
import { useUserForm } from '../../hooks'
import { ValidationCallbackData } from 'devextreme/common'
import { useRef } from 'react'

interface Props {
    user: User
}

interface EventsProps {
    rowUpdated: (rowAffected: boolean) => void
    closePopup: (close: boolean) => void
}

export const UserForm = (props: Props & EventsProps): JSX.Element => {
    const user = { ...props.user, status: true }
    const formRef = useRef<FormRef>(null)
    const { changePasswordBoxMode, changeConfirmPasswordBoxMode, onFormSubmit } = useUserForm({
        user,
        formRef,
        rowUpdated: props.rowUpdated,
        closePopup: props.closePopup,
    })

    const passwordConfirm = (eventoValidacionPassword: ValidationCallbackData): boolean => {
        if (!user.password) return true

        return eventoValidacionPassword.value === user.password
    }

    return (
        <form onSubmit={onFormSubmit}>
            <Form ref={formRef} formData={user} colCount={2} showValidationSummary={true} validationGroup="formUsers">
                <Item
                    dataField="user"
                    label={{
                        text: 'Usuario',
                    }}
                    editorType="dxTextBox"
                    editorOptions={{
                        placeholder: 'Usuario',
                    }}
                >
                    <ValidationRule type="required" message="El usuario es requerido" />
                </Item>

                <Item
                    dataField="name"
                    label={{
                        text: 'Nombre',
                    }}
                    editorType="dxTextBox"
                    editorOptions={{
                        placeholder: 'Nombre',
                    }}
                >
                    <ValidationRule type="required" message="El Nombre es requerido" />
                </Item>

                <Item
                    dataField="email"
                    label={{
                        text: 'Correo Electrónico',
                    }}
                    editorType="dxTextBox"
                    editorOptions={{
                        placeholder: 'Correo Electrónico',
                    }}
                >
                    <ValidationRule type="required" message="El Correo Electrónico es requerido" />
                    <ValidationRule type="email" message="Correo Electrónico inválido" />
                </Item>

                <Item itemType="group">
                    <Item
                        visible={!user.user_id}
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
                        visible={!user.user_id}
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

                <Item
                    dataField="status"
                    label={{
                        text: '¿Activo?',
                    }}
                    editorType="dxCheckBox"
                    editorOptions={{
                        placeholder: 'Activo',
                    }}
                ></Item>

                <Item>
                    <Button width="100%" type="default" text="guardar" useSubmitBehavior={true} validationGroup="formUsers" />
                </Item>
            </Form>
        </form>
    )
}
