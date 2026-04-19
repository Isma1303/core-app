import { RoleService } from '../../../services'
import { useState } from 'react'
import './rolesSystemActions.scss'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertTriangle, Search, Save, CheckSquare, Square } from 'lucide-react'

const rolesService = new RoleService()

export const RolesSystemActions = (): JSX.Element => {
    const [selectedRoleId, setSelectedRoleId] = useState<number>(0)
    const [systemActionName, setSystemActionName] = useState('')
    const [systemActions, setSystemActions] = useState<any[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)

    const onRoleChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoleId(Number(e.target.value))
    }

    const onSubmitChanges = () => {}
    const changeSelectionAll = (selected: boolean) => {}
    const loadSystemActionsData = (id: number, name?: string) => {}

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Seleccionar Rol</label>
                    <select className="form-select" value={selectedRoleId} onChange={onRoleChanged}>
                        <option value={0}>Seleccionar Rol</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button onClick={onSubmitChanges} disabled={selectedRoleId === 0}>
                            <Save className="h-4 w-4" />
                            Guardar cambios
                        </Button>
                        <Button variant="outline" onClick={() => changeSelectionAll(true)} disabled={selectedRoleId === 0}>
                            <CheckSquare className="h-4 w-4" />
                            Seleccionar todos
                        </Button>
                        <Button variant="outline" onClick={() => changeSelectionAll(false)} disabled={selectedRoleId === 0}>
                            <Square className="h-4 w-4" />
                            Deseleccionar todos
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Ingrese el nombre de la acción"
                            value={systemActionName}
                            onChange={(e) => setSystemActionName(e.target.value)}
                            className="h-9"
                        />
                        <Button onClick={() => loadSystemActionsData(selectedRoleId, systemActionName)} disabled={selectedRoleId === 0}>
                            <Search className="h-4 w-4" />
                            Buscar
                        </Button>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                <h3 className="text-xl font-semibold tracking-tight">Acciones del sistema</h3>

                {systemActions.length === 0 && !isLoadingData && selectedRoleId > 0 && (
                    <div className="alert flex items-center justify-center gap-2 text-center">
                        <AlertTriangle className="h-5 w-5" />
                        <span>No se encontraron acciones del sistema</span>
                    </div>
                )}
                {selectedRoleId === 0 && (
                    <div className="alert flex items-center justify-center gap-2 text-center">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Seleccione un rol para ver las acciones del sistema</span>
                    </div>
                )}

                {isLoadingData && (
                    <div className="flex h-[520px] items-center justify-center">
                        <div>Cargando...</div>
                    </div>
                )}

                {!isLoadingData && (
                    <div className="h-[520px] w-full overflow-y-auto pr-1">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {systemActions.map((action) => (
                                <div key={action.system_action_id} className="card flex h-44 flex-col gap-2 p-3">
                                    <h5 className="text-sm font-semibold">{action.system_action_name}</h5>
                                    <div className="h-12 overflow-y-auto">
                                        <p className="text-sm text-muted-foreground">{action.description}</p>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
                                        <label className="text-xs font-medium text-muted-foreground">Asignado</label>
                                        <input type="checkbox" checked={action.assigned} onChange={(e) => {}} className="h-4 w-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
