/* eslint-disable no-unused-vars */
import { MenuOptionToRole, Role } from '../interfaces'
import { Condition, DataService } from '../../shared/interfaces'
import { MenuOptionsToRolesService } from '../services'

interface Params {
    menuOptionId: number
    roleId: number
    menuOptionsToRolesService: MenuOptionsToRolesService
    rolesService: DataService<Role>
    menuOptionsToRolesDatagrid: React.RefObject<any>
}

interface UseMenuOptionsToRoles {
    rolesCustomStore: any
    rolesToMenuOptionsCustomStore: any
    rolesConfig: any
    saveAssignments: () => Promise<void>
    syncTreeView: (e: any) => Promise<void>
}

export const useMenuOptionsToRoles = (params: Params): UseMenuOptionsToRoles => {
    const options: Set<number> = new Set()
    const rolesCustomStore = {
        key: 'role_id',
        load: async (loadOptions: any) => {
            if (params.menuOptionId !== 0) {
                return params.menuOptionsToRolesService
                    .getRoles(params.menuOptionId)
                    .then((res) => {
                        return res.filter((reg: MenuOptionToRole) => reg.assigned == true)
                    })
                    .catch(() => {
                        return []
                    })
            } else {
                const totalRecords = await params.rolesService.getTotalRecords()
                if (totalRecords === 0) return []
                return params.rolesService.getRecords(loadOptions.skip || 0, loadOptions.take || totalRecords).catch(() => [])
            }
        },
    }

    const rolesToMenuOptionsCustomStore = {
        key: 'menu_option_id',
        load: async () => {
            if (params.roleId === 0) return []
            return params.menuOptionsToRolesService.getAdminMenuOptions(params.roleId).catch(() => {
                return []
            })
        },
    }

    const rolesConfig: any = {
        dataSource: rolesCustomStore,
        dataId: 'role_id',
        columns: [
            {
                dataField: 'role',
                caption: 'Rol',
                allowFiltering: true,
                validationRules: [
                    {
                        type: 'required',
                        message: 'El rol es requerido',
                    },
                ],
            },
        ],
        showBorders: true,
        showSearch: true,
        showFilters: false,
        allowReordering: true,
        allowColumnSelection: false,
        pageRecords: [5, 10, 20],
        buttonsInLastColumn: true,
        enableMultipleSelection: true,
        selectionMode: 'single',
        margin: '1',
    }

    const saveAssignments = async () => {
        const menuOptionsToRole = Array.from(options)
            .filter((option) => !!option)
            .map((menuOptionId) => {
                return { menu_option_id: menuOptionId, role_id: params.roleId }
            })

        const condiciones: Condition[] = [
            {
                field: 'role_id',
                value: params.roleId,
            },
        ]
        const deletePermisionResponse = await params.menuOptionsToRolesService.deleteMenuOptions(condiciones).catch(() => 0)

        if (deletePermisionResponse === 1) {
            alert('Permisos Revocados con Éxito')
        }

        if (menuOptionsToRole.length > 0) {
            const respuestaAsignacionPermisos = await params.menuOptionsToRolesService
                .createRecords(menuOptionsToRole)
                .catch(() => ({} as MenuOptionToRole))

            if (respuestaAsignacionPermisos.role_id) {
                alert('Permisos Aplicados con Éxito')
            }
        }
    }

    const syncTreeView = async (e: any) => {
        options.clear()
        e.component.getSelectedNodes().forEach((node: any) => {
            options.add(Number(node?.parent?.parent?.itemData?.id))
            options.add(Number(node?.parent?.itemData?.id))
            options.add(Number(node?.itemData?.id))
        })
    }

    return {
        rolesCustomStore,
        rolesToMenuOptionsCustomStore,
        rolesConfig,
        saveAssignments,
        syncTreeView,
    }
}
