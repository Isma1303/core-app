import { useEffect, useState } from 'react'
import { UsersService } from '../services'
import { User } from '../interfaces'
import { UserChangePasswordForm, UserForm } from '../components'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, UsersRound } from 'lucide-react'

export const Users = () => {
    const [userData, setUserData] = useState<User | null>(null)
    const [showUserForm, setShowUserForm] = useState(false)
    const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false)

    const unmountForm = () => {
        setUserData(null)
        setShowUserForm(false)
        setShowPasswordChangeForm(false)
    }

    const onRowAffected = () => {
        unmountForm()
        // Here we would reload data
    }

    return (
        <div className="space-y-4 p-4">
            <h2 className="content-block">Usuarios</h2>

            <div className="dx-card space-y-3 p-4">
                <p className="text-sm text-muted-foreground">Módulo de Usuarios - Grid (DevExtreme) eliminado.</p>
                <Button
                    onClick={() => {
                        setUserData({} as User)
                        setShowUserForm(true)
                    }}
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </div>

            <div className="dx-card p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                <div className="mx-auto flex w-fit items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2">
                                    <UsersRound className="h-4 w-4" />
                                    Listo para migración a shadcn/ui DataTable
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showUserForm} onOpenChange={(open) => !open && unmountForm()}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{userData?.user_id ? 'Actualizar usuario' : 'Crear usuario'}</DialogTitle>
                    </DialogHeader>
                    {showUserForm && <UserForm user={userData!} rowUpdated={onRowAffected} closePopup={unmountForm} />}
                    <Button variant="outline" onClick={unmountForm}>
                        Cerrar
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog open={showPasswordChangeForm} onOpenChange={(open) => !open && unmountForm()}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Actualizar contraseña</DialogTitle>
                    </DialogHeader>
                    {showPasswordChangeForm && <UserChangePasswordForm user={userData!} rowUpdated={onRowAffected} closePopup={unmountForm} />}
                    <Button variant="outline" onClick={unmountForm}>
                        Cerrar
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
