import { SelectBox } from 'devextreme-react'
import { customStoreReadOnlyBuilder } from '../../../shared/builders/custom-store-builder.builder'
import { Action } from '../../interfaces'
import { ActionsService, ActionsToRolesService } from '../../services'
import { useRef, useState } from 'react'
import { useActionsToRoles } from '../../hooks'
import { RoleService } from '../../services/roles.service'
import { ScpGrid } from '../../../shared/components'
import { SelectBoxTypes } from 'devextreme-react/cjs/select-box'

import { DataGridTypes } from 'devextreme-react/cjs/data-grid'

const actionsService = new ActionsService()
const rolesService = new RoleService()
const actionsToRolesService = new ActionsToRolesService()

export const ActionsToRoles = (): JSX.Element => {
    const rolesDataGrid = useRef<any>(null)
    const actionsDataGrid = useRef<any>(null)

    const [actionId, setActionId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)

    const actionsCustomStore = customStoreReadOnlyBuilder<Action>(actionsService, 'action_id')

    const { rolesConfig, actionsConfig, saveAssignments } = useActionsToRoles({
        actionId,
        roleId,
        actionsToRolesService,
        rolesService,
        actionsToRolesDatagrid: actionsDataGrid?.current?.dataGrid,
    })

    const rolesFilters = (selectionChangeEvent: SelectBoxTypes.SelectionChangedEvent): void => {
        if (selectionChangeEvent.selectedItem === null) {
            setActionId(0)
            rolesDataGrid.current?.refreshDataGrid()
            return
        }

        setActionId(selectionChangeEvent.selectedItem.action_id || 0)
        if (actionId === 0) return

        actionsToRolesService.getRoles(actionId).then(() => {
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
                        <h6>Lista de Acciones</h6>
                    </div>
                    <div className="row">
                        <SelectBox
                            dataSource={actionsCustomStore}
                            displayExpr="action"
                            valueExpr="action_id"
                            value={actionId}
                            placeholder="Seleccionar Acción"
                            searchEnabled={true}
                            searchExpr="action"
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
                    <b>Acciones de Rol</b>
                </p>
                <div className="mt-2">
                    <ScpGrid ref={actionsDataGrid} configuration={actionsConfig} onSaving={saveAssignments} />
                </div>
            </div>
        </div>
    )
}
