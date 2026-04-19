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

    const validateActualPassword = async (currentPassword: string): Promise<boolean> => {
        if (!user.user_id) return false

        const persistedUser = await userService.getRecord(user.user_id)
        const encodedPassword = btoa(currentPassword || '')

        return persistedUser?.password === encodedPassword
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col items-center justify-center p-8 bg-card border rounded-xl border-border shadow-sm">
                <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full ring-4 ring-background shadow-lg">
                    <img alt={user.name || 'Profile'} src={user.profile_picture || './assets/avatar.jpg'} className="object-cover w-full h-full" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight">{user.name || 'Usuario'}</h2>
                <p className="text-muted-foreground mt-1">{user.email || 'Cargando información...'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Information Form */}
                <div className="p-6 bg-card border rounded-xl border-border shadow-sm">
                    <form onSubmit={onUserFormSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight">Información de Usuario</h3>
                            <p className="text-sm text-muted-foreground">Gestiona tu información personal.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">Usuario</label>
                                <input
                                    className="flex w-full h-10 px-3 py-2 text-sm bg-muted/50 border rounded-md border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    value={user.user || ''}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">Correo Electrónico</label>
                                <input
                                    className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    type="email"
                                    value={user.email || ''}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">Nombre</label>
                                <input
                                    className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    type="text"
                                    value={user.name || ''}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Guardar Cambios
                        </button>
                    </form>
                </div>

                {/* Password Update Form */}
                <div className="p-6 bg-card border rounded-xl border-border shadow-sm">
                    <form onSubmit={onPasswordFormSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight">Seguridad</h3>
                            <p className="text-sm text-muted-foreground">Actualiza y protege tu contraseña.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">Contraseña Actual</label>
                                <input
                                    className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    type={passwordType}
                                    onChange={(e) => (passwordData.currentPassword = e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">Nueva Contraseña</label>
                                <input
                                    className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    type={passwordType}
                                    onChange={(e) => (passwordData.password = e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">Confirmar Contraseña</label>
                                <input
                                    className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    type={passwordType}
                                    onChange={(e) => (passwordData.confirmPassword = e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    className="w-4 h-4 rounded border-primary text-primary focus:ring-primary focus:ring-2"
                                    checked={showPasswordValue}
                                    onChange={(e) => {
                                        setShowPasswordValue(e.target.checked)
                                        setPasswordType(e.target.checked ? 'text' : 'password')
                                    }}
                                />
                                <label
                                    htmlFor="showPassword"
                                    className="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Mostrar Contraseñas
                                </label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Actualizar Contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
