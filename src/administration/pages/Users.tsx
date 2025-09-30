import { useUsersDataGridConfig } from '../hooks'
import { UsersService } from '../services'
import { ScpGrid } from '../../shared/components'
import { User } from '../interfaces'
import { customStoreBuilder } from '../../shared/builders/custom-store-builder.builder'
import { useEffect, useRef, useState } from 'react'
import { ScpGridConfig } from '../../shared/interfaces'
import { Popup, ScrollView } from 'devextreme-react'
import { UserChangePasswordForm, UserForm } from '../components'

export const Users = () => {
    const usersDataGrid = useRef<any>(null)

    const usersService = new UsersService()

    const { obtenerConfig, customButtonClicked, userData, showPasswordChangeForm, enableUserForm, onRowAffected, showUserForm, unmountForm } =
        useUsersDataGridConfig(usersService, usersDataGrid?.current?.dataGrid)

    const usersCustomStore = customStoreBuilder<User>(usersService, 'user_id')
    const [usersConfiguration, setUsersConfiguration] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(usersCustomStore).then((config) => {
            setUsersConfiguration(config)
        })
    }, [])

    return (
        <>
            <h2 className="content-block">Usuarios</h2>
            {usersConfiguration && (
                <ScpGrid
                    ref={usersDataGrid}
                    configuration={usersConfiguration!}
                    customButtonClicked={customButtonClicked}
                    addRow={enableUserForm}
                    getSelectedDataEvent={enableUserForm}
                />
            )}

            {userData && showUserForm && (
                <Popup
                    width={userData?.user_id ? '50vw' : '40vw'}
                    height="auto"
                    maxHeight="95vh"
                    showTitle={true}
                    title={userData?.user_id ? 'Crear usuario' : 'Actualizar usuario'}
                    showCloseButton={true}
                    visible={showUserForm}
                    onHidden={() => unmountForm()}
                >
                    <ScrollView width="100%" height="100%">
                        <UserForm user={userData!} rowUpdated={onRowAffected} closePopup={() => unmountForm()} />
                    </ScrollView>
                </Popup>
            )}

            {userData && showPasswordChangeForm && (
                <Popup
                    width={userData?.user_id ? '50vw' : '40vw'}
                    height="auto"
                    maxHeight="95vh"
                    showTitle={true}
                    title={'Actualizar contraseña'}
                    showCloseButton={true}
                    visible={showPasswordChangeForm}
                    onHidden={() => unmountForm()}
                >
                    <ScrollView width="100%" height="100%">
                        <UserChangePasswordForm user={userData!} rowUpdated={onRowAffected} closePopup={() => unmountForm()} />
                    </ScrollView>
                </Popup>
            )}
        </>
    )
}
