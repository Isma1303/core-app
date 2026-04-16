/* eslint-disable no-unused-vars */
import { UsersToRolesService } from '../services'
import { Role } from '../interfaces'
import { Condition, DataService } from '../../shared/interfaces'

interface Params {
    userId: number
    roleId: number
    usersToRolesService: UsersToRolesService
    rolesService: DataService<Role>
    usersToRolesDatagrid: React.RefObject<any>
}

interface UseUsersToRoles {
    rolesCustomStore: any
    rolesToUsersCustomStore: any
    rolesConfig: any
    usersConfig: any
    saveAssignments: (savingRowsEvent: any) => Promise<void>
}

export const useUsersToRoles = (params: Params): UseUsersToRoles => {
    const rolesCustomStore: any = {
        // Simplified placeholder for the roles data loading logic
    }

    const rolesToUsersCustomStore: any = {
        // Simplified placeholder for the roles-to-users data loading logic
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

    const usersConfig: any = {
        dataSource: rolesToUsersCustomStore,
        dataId: 'accion_id',
        columns: [
            {
                dataField: 'assigned',
                caption: '¿Está Asignado?',
                dataType: 'boolean',
                width: 140,
            },
            {
                dataField: 'name',
                caption: 'Usuario',
                sortOrder: 'asc',
                allowEditing: false,
                allowFiltering: true,
                validationRules: [
                    {
                        type: 'required',
                        message: 'El usuario es requerido',
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
                    field: 'user_id',
                    operator: 'IN',
                    value: deleteAcctions,
                },
            ]
            const deletePermisionResponse = await params.usersToRolesService.deleteUsers(condiciones).catch(() => 0)

            if (deletePermisionResponse === 1) {
                alert('Permisos Revocados con Éxito')
            }
        }
        const usersToRole = savingRowsEvent.changes
            .filter((change: any) => change.data.assigned == true)
            .map((change: any) => {
                return { user_id: change.key, role_id: params.roleId }
            })
        if (usersToRole.length > 0) {
            const respuestaAsignacionPermisos = await params.usersToRolesService.createRecords(usersToRole).catch(() => ({} as any))

            if (respuestaAsignacionPermisos.role_id) {
                alert('Permisos Aplicados con Éxito')
            }
        }
        params.usersToRolesDatagrid.current?.instance().refresh()
        params.usersToRolesDatagrid.current?.instance().cancelEditData()
    }

    return {
        rolesCustomStore,
        rolesToUsersCustomStore,
        rolesConfig,
        usersConfig: usersConfig,
        saveAssignments,
    }
}
