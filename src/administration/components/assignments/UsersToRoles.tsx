import { SelectBox } from 'devextreme-react'
import { ScpGrid } from '../../../shared/components'
import { RoleService, UsersService, UsersToRolesService } from '../../services'
import { useRef, useState } from 'react'
import { customStoreReadOnlyBuilder } from '../../../shared/builders/custom-store-builder.builder'
import { User } from '../../interfaces'
import { useUsersToRoles } from '../../hooks'
import { SelectBoxTypes } from 'devextreme-react/select-box'
import { DataGridTypes } from 'devextreme-react/data-grid'

const usersService = new UsersService()
const rolesService = new RoleService()
const usersToRolesService = new UsersToRolesService()

export const UsersToRoles = () => {
    const rolesDataGrid = useRef<any>(null)
    const usersDataGrid = useRef<any>(null)

    const [userId, setUserId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)

    const usersCustomStore = customStoreReadOnlyBuilder<User>(usersService, 'user_id')

    const { rolesConfig, usersConfig, saveAssignments } = useUsersToRoles({
        userId,
        roleId,
        usersToRolesService,
        rolesService,
        usersToRolesDatagrid: usersDataGrid?.current?.dataGrid,
    })

    const rolesFilters = (selectionChangeEvent: SelectBoxTypes.SelectionChangedEvent): void => {
        if (selectionChangeEvent.selectedItem === null) {
            setUserId(0)
            rolesDataGrid.current?.refreshDataGrid()
            return
        }

        setUserId(selectionChangeEvent.selectedItem.user_id || 0)
        if (userId === 0) return

        usersToRolesService.getRoles(userId).then(() => {
            rolesDataGrid.current?.refreshDataGrid()
        })
    }

    const rowChangeSelection = async (eventoCambioSeleccionFilaGrid: DataGridTypes.SelectionChangedEvent): Promise<void> => {
        setRoleId(eventoCambioSeleccionFilaGrid.selectedRowsData[0]?.role_id || 0)
        rolesDataGrid.current.refreshDataGrid()
    }

    return (
        <div className="row mx-0 mx-md-3 mt-4">
            <div className="col-md-6"></div>
            <div className="row mx-4">
                <div className="col-md-6"></div>
                <div className="col-md-6 px-0">
                    <div className="row">
                        <h6>Lista de Usuarios</h6>
                    </div>
                    <div className="row">
                        <SelectBox
                            dataSource={usersCustomStore}
                            displayExpr="name"
                            valueExpr="user_id"
                            value={userId}
                            placeholder="Seleccionar Usuario"
                            searchEnabled={true}
                            searchExpr="name"
                            searchMode="contains"
                            width="250"
                            showClearButton={true}
                            onSelectionChanged={rolesFilters}
                        />
                    </div>
                </div>
            </div>
            <div className="col-md-6 mt-2">
                <p className="mx-3">
                    <b>Roles</b>
                </p>

                <ScpGrid ref={rolesDataGrid} configuration={rolesConfig} onSelectionChanged={rowChangeSelection} />
            </div>
            <div className="col-md-6">
                <p className="mx-3 mt-2">
                    <b>Usuarios del Rol</b>
                </p>
                <div className="mt-2">
                    <ScpGrid ref={usersDataGrid} configuration={usersConfig} onSaving={saveAssignments} />
                </div>
            </div>
        </div>
    )
}
