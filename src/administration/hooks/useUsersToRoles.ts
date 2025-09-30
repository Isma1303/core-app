/* eslint-disable no-unused-vars */
import CustomStore from 'devextreme/data/custom_store'
import { UsersToRolesService } from '../services'
import { UserToRole, Role } from '../interfaces'
import { Condition, DataService } from '../../shared/interfaces'
import { ScpGridConfig } from '../../shared/interfaces'
import { DataGridRef, DataGridTypes } from 'devextreme-react/cjs/data-grid'
import notify from 'devextreme/ui/notify'

interface Params {
    userId: number
    roleId: number
    usersToRolesService: UsersToRolesService
    rolesService: DataService<Role>
    usersToRolesDatagrid: React.RefObject<DataGridRef<any, any>>
}

interface UseUsersToRoles {
    rolesCustomStore: CustomStore<UserToRole, any>
    rolesToUsersCustomStore: CustomStore<UserToRole, any>
    rolesConfig: ScpGridConfig
    usersConfig: ScpGridConfig
    saveAssignments: (savingRowsEvent: DataGridTypes.SavingEvent) => Promise<void>
}

export const useUsersToRoles = (params: Params): UseUsersToRoles => {
    const rolesCustomStore = new CustomStore({
        key: 'role_id',
        load: async (loadOptions) => {
            if (params.userId !== 0) {
                return params.usersToRolesService
                    .getRoles(params.userId)
                    .then((res) => {
                        return res.filter((reg: UserToRole) => reg.assigned == true)
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

    const rolesToUsersCustomStore = new CustomStore({
        key: 'user_id',
        load: async () => {
            if (params.roleId === 0) return []
            return params.usersToRolesService.getUsers(params.roleId).catch(() => {
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

    const usersConfig: ScpGridConfig = {
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

    const saveAssignments = async (savingRowsEvent: DataGridTypes.SavingEvent) => {
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
                notify('Permisos Revocados con Éxito', 'info', 3000)
            }
        }
        const usersToRole = savingRowsEvent.changes
            .filter((change: any) => change.data.assigned == true)
            .map((change: any) => {
                return { user_id: change.key, role_id: params.roleId }
            })
        if (usersToRole.length > 0) {
            const respuestaAsignacionPermisos = await params.usersToRolesService.createRecords(usersToRole).catch(() => ({} as UserToRole))

            if (respuestaAsignacionPermisos.role_id) {
                notify('Permisos Aplicados con Éxito', 'info', 3000)
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
