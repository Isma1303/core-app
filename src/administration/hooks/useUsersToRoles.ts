/* eslint-disable no-unused-vars */
import { UsersToRolesService } from '../services'
import { toast } from 'sonner'
import { Condition } from '../../shared/interfaces'

interface Params {
    userId: number
    usersToRolesService: UsersToRolesService
    usersToRolesDatagrid: React.RefObject<any>
}

interface UseUsersToRoles {
    userRolesCustomStore: any
    userRolesConfig: any
    saveAssignments: (savingRowsEvent: any) => Promise<void>
}

export const useUsersToRoles = (params: Params): UseUsersToRoles => {
    const userRolesCustomStore = {
        key: 'role_id',
        load: async () => {
            if (params.userId === 0) return []
            return params.usersToRolesService.getRoles(params.userId).catch(() => {
                return []
            })
        },
    }

    const userRolesConfig: any = {
        dataSource: userRolesCustomStore,
        dataId: 'role_id',
        columns: [
            {
                dataField: 'assigned',
                caption: '¿Está Asignado?',
                dataType: 'boolean',
                width: 140,
            },
            {
                dataField: 'role',
                caption: 'Rol',
                sortOrder: 'asc',
                allowEditing: false,
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
        if (params.userId === 0) {
            toast.warning('Selecciona un usuario para asignar roles')
            return
        }

        const deleteRoles = savingRowsEvent.changes.filter((change: any) => change.data.assigned == false).map((change: any) => change.key)
        if (deleteRoles.length > 0) {
            const condiciones: Condition[] = [
                {
                    field: 'user_id',
                    value: params.userId,
                },
                {
                    field: 'role_id',
                    operator: 'IN',
                    value: deleteRoles,
                },
            ]
            const deletePermisionResponse = await params.usersToRolesService.deleteUsers(condiciones).catch(() => 0)

            if (deletePermisionResponse === 1) {
                toast.success('Permisos Revocados con Éxito')
            }
        }
        const usersToRole = savingRowsEvent.changes
            .filter((change: any) => change.data.assigned == true)
            .map((change: any) => {
                return { user_id: params.userId, role_id: change.key }
            })
        if (usersToRole.length > 0) {
            const respuestaAsignacionPermisos = await params.usersToRolesService.createRecords(usersToRole).catch(() => ({}) as any)

            if (respuestaAsignacionPermisos.role_id) {
                toast.success('Permisos Aplicados con Éxito')
            }
        }
        // ScpGrid will refresh after saving if configured correctly
    }

    return {
        userRolesCustomStore,
        userRolesConfig,
        saveAssignments,
    }
}
