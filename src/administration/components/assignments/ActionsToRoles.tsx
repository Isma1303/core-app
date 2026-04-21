import { Action } from '../../interfaces'
import { ActionsService, ActionsToRolesService, RoleService } from '../../services'
import { useEffect, useRef, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScpGrid } from '@/shared/components'
import { useActionsToRoles } from '../../hooks/useActionsToRoles'

const actionsService = new ActionsService()
const rolesService = new RoleService()
const actionsToRolesService = new ActionsToRolesService()

export const ActionsToRoles = (): JSX.Element => {
    const [actionId, setActionId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)
    const [actions, setActions] = useState<Action[]>([])
    const actionsToRolesDatagrid = useRef<any>(null)

    const { rolesConfig, actionsConfig, saveAssignments } = useActionsToRoles({
        actionId,
        roleId,
        actionsToRolesService,
        rolesService,
        actionsToRolesDatagrid,
    })

    useEffect(() => {
        actionsService
            .getRecords(0, 100)
            .then((res) => setActions(res || []))
            .catch((err) => {
                console.error('Error fetching actions:', err)
                setActions([])
            })
    }, [])

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md animate-in fade-in duration-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-bold">Lista de Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select value={String(actionId)} onValueChange={(value) => setActionId(Number(value))}>
                        <SelectTrigger className="w-full h-11 border-border/60 bg-background/50 focus:ring-1 focus:ring-foreground/10">
                            <SelectValue placeholder="Seleccionar Acción para ver sus Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Seleccionar Acción</SelectItem>
                            {actions.map((a) => (
                                <SelectItem key={a.action_id} value={String(a.action_id)}>
                                    {a.action}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="rounded-xl border border-border/40 overflow-hidden bg-background/40">
                        <ScpGrid
                            configuration={{
                                ...rolesConfig,
                                onSelectionChanged: (e: any) => {
                                    const selectedRow = e.selectedRowsData[0]
                                    if (selectedRow) setRoleId(selectedRow.role_id)
                                },
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md animate-in fade-in duration-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-bold">Asignar Acciones al Rol</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-border/40 overflow-hidden bg-background/40">
                        <ScpGrid
                            key={`role-actions-${roleId}`}
                            configuration={{
                                ...actionsConfig,
                                onSaving: saveAssignments,
                            }}
                            gridRef={actionsToRolesDatagrid}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
