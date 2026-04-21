import { UsersService, UsersToRolesService } from '../../services'
import { useEffect, useRef, useState } from 'react'
import { User } from '../../interfaces'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScpGrid } from '@/shared/components'
import { useUsersToRoles } from '../../hooks/useUsersToRoles'

const usersService = new UsersService()
const usersToRolesService = new UsersToRolesService()

export const UsersToRoles = () => {
    const [userId, setUserId] = useState<number>(0)
    const [users, setUsers] = useState<User[]>([])
    const usersToRolesDatagrid = useRef<any>(null)

    const { userRolesConfig, saveAssignments } = useUsersToRoles({
        userId,
        usersToRolesService,
        usersToRolesDatagrid,
    })

    useEffect(() => {
        usersService
            .getRecords(0, 100)
            .then((res) => setUsers(res || []))
            .catch((err) => {
                console.error('Error fetching users:', err)
                setUsers([])
            })
    }, [])

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md animate-in fade-in duration-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-bold">Lista de Usuarios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select value={String(userId)} onValueChange={(value) => setUserId(Number(value))}>
                        <SelectTrigger className="w-full h-11 border-border/60 bg-background/50 focus:ring-1 focus:ring-foreground/10">
                            <SelectValue placeholder="Seleccionar Usuario para ver sus Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Seleccionar Usuario</SelectItem>
                            {users.map((u) => (
                                <SelectItem key={u.user_id} value={String(u.user_id)}>
                                    {u.name} ({u.user})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <p className="text-sm text-muted-foreground">Selecciona un usuario para ver y editar los roles que tiene asignados.</p>
                </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md animate-in fade-in duration-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-bold">Asignar Roles al Usuario</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-border/40 overflow-hidden bg-background/40">
                        <ScpGrid
                            key={`user-roles-${userId}`}
                            configuration={{
                                ...userRolesConfig,
                                onSaving: saveAssignments,
                            }}
                            gridRef={usersToRolesDatagrid}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
