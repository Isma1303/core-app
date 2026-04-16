/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import './profilePage.scss'
import { User } from '../../../administration/interfaces'
import { useAuthStore } from '../../../auth'
import { UsersService } from '../../../administration/services'

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

    const onUserFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (window.confirm('¿Está seguro de que desea actualizar la información de usuario?')) {
            const { user_id, password, ...data } = user
            userService.updateRecord(user_id!, data).then((response) => {
                if (response) {
                    alert('La información de usuario ha sido actualizada correctamente')
                }
            })
        }
    }

    const onPasswordFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const isValidActualPassword = await validateActualPassword(passwordData.currentPassword)
        if (!isValidActualPassword) {
            alert('La contraseña actual es incorrecta')
            return
        }

        if (!window.confirm('¿Está seguro de que desea actualizar la contraseña?, esta acción cerrará su sesión actual')) return

        const updateResponse = await userService.updateRecord(user.user_id!, { password: btoa(passwordData.password) })

        if (updateResponse) {
            alert('La contraseña ha sido actualizada correctamente')
            deauthenticate()
        }
    }

    return (
        <div className="content-block dx-card responsive-paddings">
            <div className={'form-avatar d-flex align-items-center justify-content-center w-100'} style={{ border: 0 }}>
                <img alt={''} src={user.profile_picture || './assets/avatar.jpg'} style={{ borderRadius: '50%' }} />
            </div>
            
            <form onSubmit={onUserFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <h3>Información de Usuario</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label>Usuario</label>
                        <input type="text" value={user.user || ''} disabled style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div>
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            value={user.email || ''} 
                            onChange={(e) => setUser({ ...user, email: e.target.value })} 
                            style={{ width: '100%', padding: '0.5rem' }} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Nombre</label>
                        <input 
                            type="text" 
                            value={user.name || ''} 
                            onChange={(e) => setUser({ ...user, name: e.target.value })} 
                            style={{ width: '100%', padding: '0.5rem' }} 
                            required 
                        />
                    </div>
                </div>
                <button type="submit" style={{ alignSelf: 'flex-end', padding: '0.5rem 1rem' }}>Guardar Cambios</button>
            </form>

            <form onSubmit={onPasswordFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>Actualizar contraseña</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Contraseña Actual</label>
                        <input 
                            type={passwordType} 
                            onChange={(e) => (passwordData.currentPassword = e.target.value)} 
                            style={{ width: '100%', padding: '0.5rem' }} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Nueva Contraseña</label>
                        <input 
                            type={passwordType} 
                            onChange={(e) => (passwordData.password = e.target.value)} 
                            style={{ width: '100%', padding: '0.5rem' }} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Confirmar Contraseña</label>
                        <input 
                            type={passwordType} 
                            onChange={(e) => (passwordData.confirmPassword = e.target.value)} 
                            style={{ width: '100%', padding: '0.5rem' }} 
                            required 
                        />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                            type="checkbox" 
                            checked={showPasswordValue} 
                            onChange={(e) => {
                                setShowPasswordValue(e.target.checked)
                                setPasswordType(e.target.checked ? 'text' : 'password')
                            }} 
                        />
                        <label>Ver Contraseña</label>
                    </div>
                </div>
                <button type="submit" style={{ alignSelf: 'flex-end', padding: '0.5rem 1rem' }}>Actualizar contraseña</button>
            </form>
        </div>
    )
}
