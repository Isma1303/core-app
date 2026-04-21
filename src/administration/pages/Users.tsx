import { useEffect, useState, useRef } from 'react'
import { UsersService } from '../services'
import { User } from '../interfaces'
import { UserChangePasswordForm, UserForm } from '../components'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { ScpGrid } from '../../shared/components'
import { useUsersDataGridConfig } from '../hooks'
import { customStoreBuilder } from '@/shared/builders/custom-store-builder.builder'
import { ScpGridConfig } from '@/shared/interfaces/scp-grid-config.interface'

export const Users = () => {
    const usersService = new UsersService()
    const datagridRef = useRef<any>(null)
    const { obtenerConfig, customButtonClicked, userData, showPasswordChangeForm, enableUserForm, onRowAffected, showUserForm, unmountForm } =
        useUsersDataGridConfig(usersService, datagridRef)

    const usersCustomStore = customStoreBuilder<User>(usersService, 'user_id')
    const [usersConfiguration, setUsersConfiguration] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(usersCustomStore).then((config) => {
            config.customButtonClicked = customButtonClicked
            config.onEditClick = (record: Record<string, any>) => enableUserForm({ record })
            config.allowCreate = false // We handle creation with our own button
            setUsersConfiguration(config)
        })
    }, [])

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Usuarios</h2>
                    <p className="text-muted-foreground text-sm">Administra los usuarios del sistema y sus accesos.</p>
                </div>
                <Button
                    onClick={() => enableUserForm(true)}
                    className="bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98]"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </div>

            <div className="px-4 pb-8">{usersConfiguration && <ScpGrid ref={datagridRef} configuration={usersConfiguration!} />}</div>

            <Dialog open={showUserForm} onOpenChange={(open) => !open && unmountForm()}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{userData?.user_id ? 'Actualizar usuario' : 'Crear usuario'}</DialogTitle>
                    </DialogHeader>
                    {showUserForm && <UserForm user={userData!} rowUpdated={() => onRowAffected(true)} closePopup={unmountForm} />}
                </DialogContent>
            </Dialog>

            <Dialog open={showPasswordChangeForm} onOpenChange={(open) => !open && unmountForm()}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Actualizar contraseña</DialogTitle>
                    </DialogHeader>
                    {showPasswordChangeForm && (
                        <UserChangePasswordForm user={userData!} rowUpdated={() => onRowAffected(true)} closePopup={unmountForm} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
