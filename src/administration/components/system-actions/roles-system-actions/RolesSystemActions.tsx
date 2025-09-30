import { RoleService } from '../../../services'
import { customStoreReadOnlyBuilder } from '../../../../shared/builders/custom-store-builder.builder'
import { Button, LoadIndicator, ScrollView, SelectBox, Switch, TextBox } from 'devextreme-react'
import { SwitchTypes } from 'devextreme-react/switch'
import './rolesSystemActions.scss'
import { TextBoxTypes } from 'devextreme-react/text-box'
import { useRolesSystemActions } from '../../../hooks'

const rolesService = new RoleService()

export const RolesSystemActions = (): JSX.Element => {
    const rolesCustomStore = customStoreReadOnlyBuilder(rolesService, 'role_id')

    const {
        systemActions,
        selectedRoleId,
        isLoadingData,
        systemActionName,
        setSystemActionName,
        valueSwitchChanged,
        onRoleChanged,
        loadSystemActionsData,
        onSubmitChanges,
        changeSelectionAll,
    } = useRolesSystemActions()

    return (
        <div className="container mt-4">
            <div className="mb-3 row">
                <div className="col">
                    <label className="form-label">Seleccionar Rol:</label>
                    <SelectBox
                        dataSource={rolesCustomStore}
                        valueExpr="role_id"
                        displayExpr="role"
                        searchEnabled={true}
                        searchExpr="role"
                        searchMode="contains"
                        placeholder="Seleccionar Rol"
                        showClearButton={true}
                        onValueChanged={onRoleChanged}
                    />
                </div>
                <div className="col">
                    <div className="col d-flex align-items-center justify-content-end gap-1">
                        <Button icon="save" text="Guardar cambios" type="default" onClick={onSubmitChanges} disabled={selectedRoleId === 0} />
                        <Button
                            icon="bi bi-list-check"
                            text="Seleccionar todos"
                            type="default"
                            stylingMode="outlined"
                            onClick={() => changeSelectionAll(true)}
                            disabled={selectedRoleId === 0}
                        />
                        <Button
                            icon="bi bi-list-task"
                            text="Deseleccionar todos"
                            type="default"
                            stylingMode="outlined"
                            onClick={() => changeSelectionAll(false)}
                            disabled={selectedRoleId === 0}
                        />
                    </div>
                    <div className="col  d-flex align-items-center justify-content-end gap-1 mt-2">
                        <TextBox
                            label="Buscar acción"
                            labelMode="floating"
                            placeholder="Ingrese el nombre de la acción"
                            value={systemActionName}
                            width={450}
                            showClearButton={true}
                            onValueChanged={(event: TextBoxTypes.ValueChangedEvent) => {
                                setSystemActionName(event.value)
                                if (!event.value) loadSystemActionsData(selectedRoleId)
                            }}
                            onEnterKey={() => loadSystemActionsData(selectedRoleId, systemActionName)}
                        />
                        <Button
                            icon="bi bi-search"
                            text="Buscar"
                            type="default"
                            onClick={() => loadSystemActionsData(selectedRoleId, systemActionName)}
                            disabled={selectedRoleId === 0}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <h3>Acciones del sistema</h3>

                {systemActions.length === 0 && !isLoadingData && selectedRoleId > 0 && (
                    <div className="alert alert-warning text-center">
                        <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '50px' }}></i> <br /> No se encontraron acciones del sistema
                    </div>
                )}
                {selectedRoleId === 0 && (
                    <div className="alert alert-warning text-center">
                        <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '50px' }}></i> <br /> Seleccione un rol para ver las
                        acciones del sistema
                    </div>
                )}

                {isLoadingData && (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '520px' }}>
                        <LoadIndicator id="large-indicator" height={60} width={60} />
                    </div>
                )}

                {!isLoadingData && (
                    <ScrollView
                        height="520px"
                        width="100%"
                        reachBottomText="Updating..."
                        scrollByContent={true}
                        showScrollbar="onScroll"
                        scrollByThumb={true}
                    >
                        <div className="row">
                            {systemActions.map((action) => (
                                <div key={action.system_action_id} className="col-md-3 col-sm-12 col-lg-3">
                                    <div className="card p-3 mb-3 shadow-sm" style={{ height: '162px' }}>
                                        <h5>{action.system_action_name}</h5>

                                        <ScrollView height="40px" width="100%" scrollByContent={true} showScrollbar="onScroll" scrollByThumb={true}>
                                            <p className="text-muted">{action.description}</p>
                                        </ScrollView>

                                        <div className="d-flex flex-column justify-content-end">
                                            <label className="form-label">Asignado</label>
                                            <Switch
                                                value={action.assigned}
                                                onValueChanged={(event: SwitchTypes.ValueChangedEvent) => valueSwitchChanged(event, action)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollView>
                )}
            </div>
        </div>
    )
}
