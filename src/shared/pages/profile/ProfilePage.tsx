/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import './profilePage.scss'
import Form, { Item, ValidationRule } from 'devextreme-react/form'
import { Button, Switch } from 'devextreme-react'
import { SwitchTypes } from 'devextreme-react/switch'
import { User } from '../../../administration/interfaces'
import { useAuthStore } from '../../../auth'
import { UsersService } from '../../../administration/services'
import { confirm } from 'devextreme/ui/dialog'
import notify from 'devextreme/ui/notify'

const colCountByScreen: Record<string, number> = {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 2,
}

const passwordData: Record<string, any> = {}
const userService = new UsersService()
export const ProfilePage = (): JSX.Element => {
    const [user, setUser] = useState<User>({} as User)
    const activeUserData = useAuthStore((state) => state.user)
    const deauthenticate = useAuthStore((state) => state.deauthenticate)

    const [passwordType, setPasswordType] = useState<string>('password')
    const [showPasswordValue, setShowPasswordValue] = useState<boolean>(false)

    useEffect(() => {
        userService.getRecord(activeUserData?.user_id || 0).then((data) => {
            setUser({ ...data })
        })
    }, [])

    const comparePassword = (event: any): boolean => {
        if (event.value === passwordData.password) return true
        return false
    }

    const validateActualPassword = async (actualPassword: string): Promise<boolean> =>
        await userService.validateActualPassword(window.btoa(actualPassword))

    const onUserFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        confirm('¿Está seguro de que desea actualizar la información de usuario?', 'Confirmar').then((result) => {
            if (result) {
                const { user_id, password, ...data } = user
                userService.updateRecord(user_id!, data).then((response) => {
                    if (response) {
                        notify('La información de usuario ha sido actualizada correctamente', 'success')
                    }
                })
            }
        })
    }
    const onPasswordFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const isValidActualPassword = await validateActualPassword(passwordData.currentPassword)
        if (!isValidActualPassword) {
            notify('La contraseña actual es incorrecta', 'error')
            return
        }

        const userConfirm = await confirm('¿Está seguro de que desea actualizar la contraseña?, esta acción cerrará su sesión actual', 'Confirmar')
        if (!userConfirm) return

        const updateResponse = await userService.updateRecord(user.user_id!, { password: btoa(passwordData.password) })

        if (updateResponse) {
            notify('La contraseña ha sido actualizada correctamente', 'success')
            deauthenticate()
        }
    }

    return (
        <>
            <div className="content-block dx-card responsive-paddings">
                <div className={'form-avatar d-flex align-items-center justify-content-center w-100'} style={{ border: 0 }}>
                    <img alt={''} src={user.profile_picture || './assets/avatar.jpg'} style={{ borderRadius: '50%' }} />
                </div>
                <form onSubmit={onUserFormSubmit}>
                    <Form validationGroup="frmUsuario" labelLocation="top" formData={user}>
                        <Item itemType="group" caption="Información de Usuario" colCountByScreen={colCountByScreen}>
                            <Item dataField="user" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Usuario' }}>
                                <ValidationRule type="required" message="Debe ingresar un usuario, para continuar" />
                            </Item>
                            <Item dataField="email" label={{ text: 'Correo Electrónico' }}>
                                <ValidationRule type="required" message="Debe ingresar un correo, para continuar" />
                                <ValidationRule type="email" message="El correo es invalido" />
                            </Item>

                            <Item dataField="name" label={{ text: 'Nombre' }}>
                                <ValidationRule type="required" message="Debe ingresar un nombre, para continuar" />
                            </Item>
                            <Item cssClass="d-flex justify-content-end">
                                <Button text="Guardar Cambios" type="default" useSubmitBehavior={true} validationGroup="frmUsuario" />
                            </Item>
                        </Item>
                    </Form>
                </form>

                <form onSubmit={onPasswordFormSubmit}>
                    <Form id="form" labelLocation="top" validationGroup="frmPassword" formData={passwordData}>
                        <Item itemType="group" caption="Actualizar contraseña" colCountByScreen={colCountByScreen}>
                            <Item
                                dataField="currentPassword"
                                editorType="dxTextBox"
                                editorOptions={{ mode: passwordType }}
                                label={{ text: 'Contraseña Actual' }}
                                colSpan={2}
                            >
                                <ValidationRule type="required" message="Debe ingresar una contraseña, para continuar"></ValidationRule>
                                <ValidationRule
                                    type="pattern"
                                    message="La contraseña debe contener entre 8 y 20 caracteres, mayúsculas, minúsculas, digitos y caractéres especiales"
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})"
                                ></ValidationRule>
                            </Item>
                            <Item
                                dataField="password"
                                editorType="dxTextBox"
                                editorOptions={{ mode: passwordType }}
                                label={{ text: 'Nueva Contraseña' }}
                            >
                                <ValidationRule type="required" message="Debe ingresar una contraseña, para continuar"></ValidationRule>
                                <ValidationRule
                                    type="pattern"
                                    message="La contraseña debe contener entre 8 y 20 caracteres, mayúsculas, minúsculas, digitos y caractéres especiales"
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})"
                                ></ValidationRule>
                            </Item>

                            <Item
                                dataField="confirmPassword"
                                editorType="dxTextBox"
                                editorOptions={{ mode: passwordType }}
                                label={{ text: 'Confirmar Contraseña' }}
                            >
                                <ValidationRule
                                    type="custom"
                                    message="Las contraseñas no coinciden"
                                    validationCallback={comparePassword}
                                ></ValidationRule>
                            </Item>

                            <Item>
                                Ver Contraseña{' '}
                                <Switch
                                    value={showPasswordValue}
                                    onValueChanged={(event: SwitchTypes.ValueChangedEvent) => {
                                        setShowPasswordValue(event.value)
                                        setPasswordType(passwordType == 'text' ? 'password' : 'text')
                                    }}
                                />
                            </Item>

                            <Item cssClass="d-flex justify-content-end">
                                <Button text="Actualizar contraseña" type="default" useSubmitBehavior={true} validationGroup="frmPassword" />
                            </Item>
                        </Item>
                    </Form>
                </form>
            </div>
        </>
    )
}
