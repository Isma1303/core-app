import { Button, SelectBox, TreeView } from 'devextreme-react'
import { customStoreReadOnlyBuilder } from '../../../../shared/builders/custom-store-builder.builder'
import { MenuOption } from '../../../interfaces'
import { MenuOptionsService, MenuOptionsToRolesService } from '../../../services'
import { useRef, useState } from 'react'
import { useMenuOptionsToRoles } from '../../../hooks'
import { RoleService } from '../../../services/roles.service'
import { ScpGrid } from '../../../../shared/components'
import { SelectBoxTypes } from 'devextreme-react/cjs/select-box'
import './MenuOptionsToRoles.scss'
import { DataGridTypes } from 'devextreme-react/cjs/data-grid'

const menuOptionsService = new MenuOptionsService()
const rolesService = new RoleService()
const menuOptionsToRolesService = new MenuOptionsToRolesService()

export const MenuOptionsToRoles = (): JSX.Element => {
    const rolesDataGrid = useRef<any>(null)
    const actionsDataGrid = useRef<any>(null)

    const [menuOptionId, setMenuOptionId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)

    const menuOptionsCustomStore = customStoreReadOnlyBuilder<MenuOption>(menuOptionsService, 'menu_option_id')

    const { rolesConfig, syncTreeView, rolesToMenuOptionsCustomStore, saveAssignments } = useMenuOptionsToRoles({
        menuOptionId,
        roleId,
        menuOptionsToRolesService,
        rolesService,
        menuOptionsToRolesDatagrid: actionsDataGrid?.current?.dataGrid,
    })

    const rolesFilters = (selectionChangeEvent: SelectBoxTypes.SelectionChangedEvent): void => {
        if (selectionChangeEvent.selectedItem === null) {
            setMenuOptionId(0)
            rolesDataGrid.current?.refreshDataGrid()
            return
        }

        setMenuOptionId(selectionChangeEvent.selectedItem.menu_option_id || 0)
        if (menuOptionId === 0) return

        menuOptionsToRolesService.getRoles(menuOptionId).then(() => {
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
                        <h6>Lista de opciones de menú</h6>
                    </div>
                    <div className="row">
                        <SelectBox
                            dataSource={menuOptionsCustomStore}
                            displayExpr="menu_option"
                            valueExpr="menu_option_id"
                            value={menuOptionId}
                            placeholder="Seleccionar Menú"
                            searchEnabled={true}
                            searchExpr="menu_option"
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
                <div className="row">
                    <div className="col">
                        <p className="mx-3 mt-2">
                            <b>Opciones de menú de Rol</b>
                        </p>
                    </div>
                    <div className="col">
                        <Button
                            hint="Guardar"
                            icon="floppy"
                            type="default"
                            onClick={() => {
                                saveAssignments()
                            }}
                        />
                    </div>
                </div>
                <div className="mt-2">
                    <TreeView
                        dataSource={rolesToMenuOptionsCustomStore}
                        dataStructure="tree"
                        keyExpr="path"
                        itemsExpr="items"
                        hasItemsExpr="hasItems"
                        focusStateEnabled={false}
                        selectionMode="multiple"
                        expandEvent="click"
                        width="100%"
                        searchEnabled={false}
                        selectByClick={true}
                        showCheckBoxesMode="normal"
                        selectedExpr="assigned"
                        expandedExpr="expanded"
                        selectNodesRecursive={true}
                        className="tree-view-container"
                        onItemSelectionChanged={syncTreeView}
                    />
                </div>
            </div>
        </div>
    )
}
