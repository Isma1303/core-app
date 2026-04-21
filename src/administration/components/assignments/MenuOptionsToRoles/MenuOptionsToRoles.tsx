import { MenuOption } from '../../../interfaces'
import { MenuOptionsService, MenuOptionsToRolesService, RoleService } from '../../../services'
import { useEffect, useRef, useState } from 'react'
import './MenuOptionsToRoles.scss'
import { Button } from '@/components/ui/button'
import { Save, ChevronRight, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScpGrid } from '@/shared/components'
import { useMenuOptionsToRoles } from '../../../hooks/useMenuOptionsToRoles'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

const menuOptionsService = new MenuOptionsService()
const rolesService = new RoleService()
const menuOptionsToRolesService = new MenuOptionsToRolesService()

type MenuTreeNode = MenuOption & { assigned?: boolean }

const normalizeMenuTree = (items: any[]): MenuTreeNode[] => {
    return items.map((item) => ({
        menu_option_id: item.menu_option_id ?? item.id,
        menu_option: item.menu_option ?? item.text ?? '',
        icon: item.icon ?? '',
        path: item.path ?? '',
        sort: String(item.sort ?? ''),
        parent_menu_option_id: item.parent_menu_option_id ?? item.parentId ?? 0,
        assigned: Boolean(item.assigned),
        items: Array.isArray(item.items) ? normalizeMenuTree(item.items) : [],
    }))
}

const collectAssignedIds = (items: MenuTreeNode[], acc = new Set<number>()) => {
    items.forEach((item) => {
        if (item.assigned && item.menu_option_id) acc.add(item.menu_option_id)
        if (item.items?.length) collectAssignedIds(item.items as MenuTreeNode[], acc)
    })

    return acc
}

export const MenuOptionsToRoles = (): JSX.Element => {
    const [roleId, setRoleId] = useState<number>(0)
    const [menuOptions, setMenuOptions] = useState<MenuTreeNode[]>([])
    const [selectedMenuIds, setSelectedMenuIds] = useState<Set<number>>(new Set())
    const [expandedMenuIds, setExpandedMenuIds] = useState<Set<number>>(new Set())
    const menuOptionsToRolesDatagrid = useRef<any>(null)

    const { rolesConfig } = useMenuOptionsToRoles({
        menuOptionId: 0,
        roleId,
        menuOptionsToRolesService,
        rolesService,
        menuOptionsToRolesDatagrid,
    })

    useEffect(() => {
        menuOptionsService
            .getNestedMenuOptions()
            .then((res) => setMenuOptions(normalizeMenuTree(res || [])))
            .catch((err) => {
                console.error('Error fetching nested menu options:', err)
                setMenuOptions([])
            })
    }, [])

    useEffect(() => {
        if (roleId > 0) {
            menuOptionsToRolesService.getAdminMenuOptions(roleId).then((res) => {
                const normalized = normalizeMenuTree(res || [])
                const assignedIds = collectAssignedIds(normalized)
                setMenuOptions(normalized)
                setSelectedMenuIds(assignedIds)
            })
        } else {
            setSelectedMenuIds(new Set())
        }
    }, [roleId])

    const toggleExpand = (id: number) => {
        setExpandedMenuIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const toggleSelect = (id: number, checked: boolean) => {
        setSelectedMenuIds((prev) => {
            const next = new Set(prev)
            if (checked) next.add(id)
            else next.delete(id)
            return next
        })
    }

    const handleSave = async () => {
        // Need to bridge our local state with what the hook expects or implement save here
        const assignments = Array.from(selectedMenuIds).map((id) => ({
            menu_option_id: id,
            role_id: roleId,
        }))

        await menuOptionsToRolesService.deleteMenuOptions([{ field: 'role_id', value: roleId }])
        if (assignments.length > 0) {
            await menuOptionsToRolesService.createRecords(assignments)
        }
        toast.success('Permisos guardados con éxito')
    }

    const renderMenuTree = (items: MenuTreeNode[], level = 0) => {
        return (
            <ul className={cn('space-y-1', level > 0 && 'ml-6 border-l border-border/50 pl-2 mt-1')}>
                {items.map((item) => {
                    const hasChildren = item.items && item.items.length > 0
                    const isExpanded = expandedMenuIds.has(item.menu_option_id!)
                    const isSelected = selectedMenuIds.has(item.menu_option_id!)

                    return (
                        <li key={item.menu_option_id} className="py-0.5">
                            <div className="flex items-center gap-2 group p-1 rounded-md hover:bg-muted/50 transition-colors">
                                {hasChildren ? (
                                    <button
                                        onClick={() => toggleExpand(item.menu_option_id!)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                ) : (
                                    <div className="w-3.5" />
                                )}
                                <Checkbox checked={isSelected} onCheckedChange={(checked) => toggleSelect(item.menu_option_id!, checked === true)} />
                                {item.icon ? <i className={cn(item.icon, 'text-sm text-muted-foreground')} /> : null}
                                <span
                                    className={cn('text-sm transition-colors', isSelected ? 'font-medium text-foreground' : 'text-muted-foreground')}
                                >
                                    {item.menu_option}
                                </span>
                            </div>
                            {hasChildren && isExpanded && renderMenuTree(item.items!, level + 1)}
                        </li>
                    )
                })}
            </ul>
        )
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md animate-in fade-in duration-500">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Roles</CardTitle>
                </CardHeader>
                <CardContent>
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
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-lg font-bold">Opciones de Menú del Rol</CardTitle>
                    <Button
                        disabled={roleId === 0}
                        size="sm"
                        className="bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98]"
                        onClick={handleSave}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                    </Button>
                </CardHeader>
                <CardContent>
                    {roleId === 0 ? (
                        <div className="rounded-lg border border-border/50 border-dashed bg-muted/20 p-12 text-sm text-muted-foreground text-center">
                            Selecciona un rol para gestionar sus opciones de menú.
                        </div>
                    ) : (
                        <div className="rounded-xl border border-border/40 p-4 bg-background/40 max-h-[500px] overflow-y-auto">
                            {renderMenuTree(menuOptions)}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
