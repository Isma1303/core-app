import { MenuOption } from '../../../interfaces'
import { MenuOptionsService, MenuOptionsToRolesService } from '../../../services'
import { useState } from 'react'
import { RoleService } from '../../../services/roles.service'
import './MenuOptionsToRoles.scss'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

const menuOptionsService = new MenuOptionsService()
const rolesService = new RoleService()
const menuOptionsToRolesService = new MenuOptionsToRolesService()

export const MenuOptionsToRoles = (): JSX.Element => {
    const [menuOptionId, setMenuOptionId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)

    const handleMenuOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMenuOptionId(Number(e.target.value))
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                <h6 className="text-sm font-semibold text-muted-foreground">Lista de opciones de menú</h6>
                <select value={menuOptionId} onChange={handleMenuOptionChange} className="form-select">
                    <option value={0}>Seleccionar Menú</option>
                </select>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-sm font-semibold text-muted-foreground">Roles</p>
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">Grid de Roles eliminado.</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 md:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-muted-foreground">Opciones de menú de Rol</p>
                    <Button variant="outline" onClick={() => {}}>
                        <Save className="h-4 w-4" />
                        Guardar
                    </Button>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                    TreeView de Opciones de Menú eliminado.
                </div>
            </div>
        </div>
    )
}
