import { RoleService, UsersService, UsersToRolesService } from '../../services'
import { useState } from 'react'
import { User } from '../../interfaces'

const usersService = new UsersService()
const rolesService = new RoleService()
const usersToRolesService = new UsersToRolesService()

export const UsersToRoles = () => {
    const [userId, setUserId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserId(Number(e.target.value))
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                <h6 className="text-sm font-semibold text-muted-foreground">Lista de Usuarios</h6>
                <select value={userId} onChange={handleUserChange} className="form-select">
                    <option value={0}>Seleccionar Usuario</option>
                </select>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-sm font-semibold text-muted-foreground">Roles</p>
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">Grid de Roles eliminado.</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 md:col-span-2">
                <p className="mb-2 text-sm font-semibold text-muted-foreground">Usuarios del Rol</p>
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Grid de Usuarios del Rol eliminado.
                </div>
            </div>
        </div>
    )
}
