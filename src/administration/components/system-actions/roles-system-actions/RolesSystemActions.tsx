import { RoleService } from '../../../services'
import { useState } from 'react'
import './rolesSystemActions.scss'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
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
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/90">Seleccionar Rol</label>
                    <Select value={String(selectedRoleId)} onValueChange={(value) => setSelectedRoleId(Number(value))}>
                        <SelectTrigger className="w-full h-10 border-border/50 focus:ring-1 focus:ring-foreground/20">
                            <SelectValue placeholder="Seleccionar Rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Seleccionar Rol</SelectItem>
                            {/* The roles map will go here */}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-3">
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button className="h-9 bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-all" onClick={onSubmitChanges} disabled={selectedRoleId === 0}>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar cambios
                        </Button>
                        <Button variant="outline" className="h-9 border-border/50 transition-all hover:bg-foreground/5" onClick={() => changeSelectionAll(true)} disabled={selectedRoleId === 0}>
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Seleccionar todos
                        </Button>
                        <Button variant="outline" className="h-9 border-border/50 transition-all hover:bg-foreground/5" onClick={() => changeSelectionAll(false)} disabled={selectedRoleId === 0}>
                            <Square className="h-4 w-4 mr-2" />
                            Deseleccionar todos
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Ingrese el nombre de la acción"
                            value={systemActionName}
                            onChange={(e) => setSystemActionName(e.target.value)}
                            className="h-9 border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all"
                        />
                        <Button variant="outline" className="h-9 border-border/50 transition-all hover:bg-foreground/5" onClick={() => loadSystemActionsData(selectedRoleId, systemActionName)} disabled={selectedRoleId === 0}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                <h3 className="text-xl font-semibold tracking-tight">Acciones del sistema</h3>

                {systemActions.length === 0 && !isLoadingData && selectedRoleId > 0 && (
                    <div className="flex items-center justify-center gap-2 text-center bg-muted/20 border border-border/50 p-8 rounded-lg text-muted-foreground animate-in fade-in duration-500">
                        <AlertTriangle className="h-5 w-5" />
                        <span>No se encontraron acciones del sistema</span>
                    </div>
                )}
                {selectedRoleId === 0 && (
                    <div className="flex items-center justify-center gap-2 text-center bg-muted/20 border border-border/50 p-8 rounded-lg text-muted-foreground animate-in fade-in duration-500">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Seleccione un rol para ver las acciones del sistema</span>
                    </div>
                )}

                {isLoadingData && (
                    <div className="flex h-[400px] items-center justify-center text-muted-foreground animate-pulse">
                        <div>Cargando...</div>
                    </div>
                )}

                {!isLoadingData && systemActions.length > 0 && (
                    <div className="h-[520px] w-full overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4">
                            {systemActions.map((action) => (
                                <Card key={action.system_action_id} className="flex flex-col h-44 overflow-hidden border-border/50 shadow-none hover:shadow-sm transition-all animate-in fade-in zoom-in-95 duration-300">
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-sm font-semibold truncate" title={action.system_action_name}>{action.system_action_name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 flex-1 overflow-y-auto">
                                        <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
                                    </CardContent>
                                    <CardFooter className="p-3 bg-muted/10 border-t border-border/50 flex items-center justify-between mt-auto">
                                        <label className="text-xs font-medium text-foreground/80">Asignado</label>
                                        <Checkbox checked={action.assigned} onCheckedChange={(c) => {}} />
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
