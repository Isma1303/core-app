import { Action } from '../../interfaces'
import { ActionsService, ActionsToRolesService } from '../../services'
import { useState } from 'react'
import { RoleService } from '../../services/roles.service'

const actionsService = new ActionsService()
const rolesService = new RoleService()
const actionsToRolesService = new ActionsToRolesService()

export const ActionsToRoles = (): JSX.Element => {
    const [actionId, setActionId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)

    const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActionId(Number(e.target.value))
    }

    return (
        <div className="row mx-0 mx-md-3 mt-4">
            <div className="row mx-4">
                <div className="col-md-6 px-0">
                    <div className="row">
                        <h6>Lista de Acciones</h6>
                    </div>
                    <div className="row">
                        <select 
                            value={actionId} 
                            onChange={handleActionChange}
                            style={{ width: '250px', padding: '0.5rem' }}
                        >
                            <option value={0}>Seleccionar Acción</option>
                            {/* Actions would be mapped here */}
                        </select>
                    </div>
                </div>
            </div>
            <div className="col-md-6 mt-2">
                <p className="mx-3">
                    <b>Roles</b>
                </p>
                <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <p>Grid de Roles eliminado.</p>
                </div>
            </div>
            <div className="col-md-6">
                <p className="mx-3 mt-2">
                    <b>Acciones de Rol</b>
                </p>
                <div className="mt-2" style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <p>Grid de Acciones de Rol eliminado.</p>
                </div>
            </div>
        </div>
    )
}
