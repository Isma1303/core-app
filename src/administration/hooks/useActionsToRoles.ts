/* eslint-disable no-unused-vars */
import { ActionsToRolesService } from '../services/actions-to-roles.service'
import { ActionToRole, Role } from '../interfaces'
import { Condition, DataService } from '../../shared/interfaces'

interface Params {
    actionId: number
    roleId: number
    actionsToRolesService: ActionsToRolesService
    rolesService: DataService<Role>
    actionsToRolesDatagrid: React.RefObject<any>
}

interface UseActionsToRoles {
    rolesCustomStore: any
    rolesToActionsCustomStore: any
    rolesConfig: any
    actionsConfig: any
    saveAssignments: (savingRowsEvent: any) => Promise<void>
}

export const useActionsToRoles = (params: Params): UseActionsToRoles => {
    const rolesCustomStore = {
        key: 'role_id',
        load: async (loadOptions: any) => {
            if (params.actionId !== 0) {
                return params.actionsToRolesService
                    .getRoles(params.actionId)
                    .then((res) => {
                        return res.filter((reg: ActionToRole) => reg.assigned == true)
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

    const rolesToActionsCustomStore = {
        key: 'action_id',
        load: async () => {
            if (params.roleId === 0) return []
            return params.actionsToRolesService.getActions(params.roleId).catch(() => {
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

    const actionsConfig: any = {
        dataSource: rolesToActionsCustomStore,
        dataId: 'accion_id',
        columns: [
            {
                dataField: 'assigned',
                caption: '¿Está Asignado?',
                dataType: 'boolean',
                width: 140,
            },
            {
                dataField: 'action',
                caption: 'Acción',
                sortOrder: 'asc',
                allowEditing: false,
                allowFiltering: true,
                validationRules: [
                    {
                        type: 'required',
                        message: 'La acción es requerida',
                    },
                ],
            },
        ],
        showBorders: true,
        showSearch: true,
        showFilters: true,
        allowReordering: true,
        allowColumnSelection: false,
        pageRecords: [5, 10, 20],
        allowUpdate: true,
        allowDelete: false,
        allowCreate: false,
        allowExportPDF: false,
        allowExportExcel: false,
        buttonsInLastColumn: true,
        margin: '1',
        editMode: 'batch',
    }

    const saveAssignments = async (savingRowsEvent: any) => {
        savingRowsEvent.cancel = true
        const deleteAcctions = savingRowsEvent.changes.filter((change: any) => change.data.assigned == false).map((change: any) => change.key)
        if (deleteAcctions.length > 0) {
            const condiciones: Condition[] = [
                {
                    field: 'role_id',
                    value: params.roleId,
                },
                {
                    field: 'action_id',
                    operator: 'IN',
                    value: deleteAcctions,
                },
            ]
            const deletePermisionResponse = await params.actionsToRolesService.deleteActions(condiciones).catch(() => 0)

            if (deletePermisionResponse === 1) {
                alert('Permisos Revocados con Éxito')
            }
        }
        const actionsToRole = savingRowsEvent.changes
            .filter((change: any) => change.data.assigned == true)
            .map((change: any) => {
                return { action_id: change.key, role_id: params.roleId }
            })
        if (actionsToRole.length > 0) {
            const respuestaAsignacionPermisos = await params.actionsToRolesService.createRecords(actionsToRole).catch(() => ({} as ActionToRole))

            if (respuestaAsignacionPermisos.role_id) {
                alert('Permisos Aplicados con Éxito')
            }
        }
        params.actionsToRolesDatagrid.current?.instance().refresh()
        params.actionsToRolesDatagrid.current?.instance().cancelEditData()
    }

    return {
        rolesCustomStore,
        rolesToActionsCustomStore,
        rolesConfig,
        actionsConfig,
        saveAssignments,
    }
}
