import { Action } from '../../interfaces'
import { ActionsService, ActionsToRolesService } from '../../services'
import { useState } from 'react'
import { RoleService } from '../../services/roles.service'

const actionsService = new ActionsService()
const rolesService = new RoleService()
const actionsToRolesService = new ActionsToRolesService()

export const ActionsToRoles = (): JSX.Element => {
    const [actionId, setActionId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)

    const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActionId(Number(e.target.value))
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                <h6 className="text-sm font-semibold text-muted-foreground">Lista de Acciones</h6>
                <select value={actionId} onChange={handleActionChange} className="form-select">
                    <option value={0}>Seleccionar Acción</option>
                </select>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-sm font-semibold text-muted-foreground">Roles</p>
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">Grid de Roles eliminado.</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 md:col-span-2">
                <p className="mb-2 text-sm font-semibold text-muted-foreground">Acciones de Rol</p>
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Grid de Acciones de Rol eliminado.
                </div>
            </div>
        </div>
    )
}
