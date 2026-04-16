import { RoleService } from '../../../services'
import { useState } from 'react'
import './rolesSystemActions.scss'

const rolesService = new RoleService()

export const RolesSystemActions = (): JSX.Element => {
    const [selectedRoleId, setSelectedRoleId] = useState<number>(0)
    const [systemActionName, setSystemActionName] = useState('')
    const [systemActions, setSystemActions] = useState<any[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)

    const onRoleChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoleId(Number(e.target.value))
    }

    const onSubmitChanges = () => {}
    const changeSelectionAll = (selected: boolean) => {}
    const loadSystemActionsData = (id: number, name?: string) => {}

    return (
        <div className="container mt-4">
            <div className="mb-3 row">
                <div className="col">
                    <label className="form-label">Seleccionar Rol:</label>
                    <select 
                        className="form-select"
                        value={selectedRoleId}
                        onChange={onRoleChanged}
                    >
                        <option value={0}>Seleccionar Rol</option>
                        {/* Roles would be mapped here */}
                    </select>
                </div>
                <div className="col">
                    <div className="col d-flex align-items-center justify-content-end gap-1">
                        <button className="btn btn-primary" onClick={onSubmitChanges} disabled={selectedRoleId === 0}>Guardar cambios</button>
                        <button className="btn btn-outline-secondary" onClick={() => changeSelectionAll(true)} disabled={selectedRoleId === 0}>Seleccionar todos</button>
                        <button className="btn btn-outline-secondary" onClick={() => changeSelectionAll(false)} disabled={selectedRoleId === 0}>Deseleccionar todos</button>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end gap-1 mt-2">
                        <input 
                            type="text"
                            placeholder="Ingrese el nombre de la acción"
                            value={systemActionName}
                            onChange={(e) => setSystemActionName(e.target.value)}
                            style={{ flex: 1, padding: '0.4rem' }}
                        />
                        <button className="btn btn-primary" onClick={() => loadSystemActionsData(selectedRoleId, systemActionName)} disabled={selectedRoleId === 0}>Buscar</button>
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
                        <div>Cargando...</div>
                    </div>
                )}

                {!isLoadingData && (
                    <div style={{ height: '520px', width: '100%', overflowY: 'auto' }}>
                        <div className="row">
                            {systemActions.map((action) => (
                                <div key={action.system_action_id} className="col-md-3 col-sm-12 col-lg-3">
                                    <div className="card p-3 mb-3 shadow-sm" style={{ height: '162px' }}>
                                        <h5>{action.system_action_name}</h5>
                                        <div style={{ height: '40px', overflowY: 'auto' }}>
                                            <p className="text-muted">{action.description}</p>
                                        </div>
                                        <div className="d-flex flex-column justify-content-end">
                                            <label className="form-label">Asignado</label>
                                            <input 
                                                type="checkbox" 
                                                checked={action.assigned} 
                                                onChange={(e) => {}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
