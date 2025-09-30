/* eslint-disable no-unused-vars */
import CustomStore from 'devextreme/data/custom_store'
import { MenuOptionToRole, Role } from '../interfaces'
import { Condition, DataService } from '../../shared/interfaces'
import { ScpGridConfig } from '../../shared/interfaces'
import { DataGridRef } from 'devextreme-react/cjs/data-grid'
import notify from 'devextreme/ui/notify'
import { MenuOptionsToRolesService } from '../services'
import { TreeViewTypes } from 'devextreme-react/cjs/tree-view'

interface Params {
    menuOptionId: number
    roleId: number
    menuOptionsToRolesService: MenuOptionsToRolesService
    rolesService: DataService<Role>
    menuOptionsToRolesDatagrid: React.RefObject<DataGridRef<any, any>>
}

interface UseMenuOptionsToRoles {
    rolesCustomStore: CustomStore<MenuOptionToRole, any>
    rolesToMenuOptionsCustomStore: CustomStore<MenuOptionToRole, any>
    rolesConfig: ScpGridConfig
    saveAssignments: () => Promise<void>
    syncTreeView: (e: TreeViewTypes.ItemSelectionChangedEvent) => Promise<void>
}

export const useMenuOptionsToRoles = (params: Params): UseMenuOptionsToRoles => {
    const options: Set<number> = new Set()
    const rolesCustomStore = new CustomStore({
        key: 'role_id',
        load: async (loadOptions) => {
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
    })

    const rolesToMenuOptionsCustomStore = new CustomStore({
        key: 'menu_option_id',
        load: async () => {
            if (params.roleId === 0) return []
            return params.menuOptionsToRolesService.getAdminMenuOptions(params.roleId).catch(() => {
                return []
            })
        },
    })

    const rolesConfig: ScpGridConfig = {
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
        // const deleteAcctions = savingRowsEvent.changes.filter((change: any) => change.data.assigned == false).map((change: any) => change.key)
        // if (deleteAcctions.length > 0) {
        const condiciones: Condition[] = [
            {
                field: 'role_id',
                value: params.roleId,
            },
        ]
        const deletePermisionResponse = await params.menuOptionsToRolesService.deleteMenuOptions(condiciones).catch(() => 0)

        if (deletePermisionResponse === 1) {
            notify('Permisos Revocados con Éxito', 'info', 3000)
        }
        // }
        // const menuOptionsToRole = savingRowsEvent.changes
        //     .filter((change: any) => change.data.assigned == true)
        //     .map((change: any) => {
        //         return { menu_option_id: change.key, role_id: params.roleId }
        //     })
        if (menuOptionsToRole.length > 0) {
            const respuestaAsignacionPermisos = await params.menuOptionsToRolesService
                .createRecords(menuOptionsToRole)
                .catch(() => ({} as MenuOptionToRole))

            if (respuestaAsignacionPermisos.role_id) {
                notify('Permisos Aplicados con Éxito', 'info', 3000)
            }
        }
    }

    const syncTreeView = async (e: TreeViewTypes.ItemSelectionChangedEvent) => {
        options.clear()
        e.component.getSelectedNodes().forEach((node: TreeViewTypes.Node) => {
            options.add(Number(node?.parent?.parent?.itemData?.id))
            options.add(Number(node?.parent?.itemData?.id))
            options.add(Number(node?.itemData?.id))
        })
        // return options
    }

    return {
        rolesCustomStore,
        rolesToMenuOptionsCustomStore,
        rolesConfig,
        saveAssignments,
        syncTreeView,
    }
}
