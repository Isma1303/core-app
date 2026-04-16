import { MenuOption } from '../../../interfaces'
import { MenuOptionsService, MenuOptionsToRolesService } from '../../../services'
import { useState } from 'react'
import { RoleService } from '../../../services/roles.service'
import './MenuOptionsToRoles.scss'

const menuOptionsService = new MenuOptionsService()
const rolesService = new RoleService()
const menuOptionsToRolesService = new MenuOptionsToRolesService()

export const MenuOptionsToRoles = (): JSX.Element => {
    const [menuOptionId, setMenuOptionId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)

    const handleMenuOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMenuOptionId(Number(e.target.value))
    }

    return (
        <div className="row mx-0 mx-md-3 mt-4">
            <div className="row mx-4">
                <div className="col-md-6 px-0">
                    <div className="row">
                        <h6>Lista de opciones de menú</h6>
                    </div>
                    <div className="row">
                        <select 
                            value={menuOptionId} 
                            onChange={handleMenuOptionChange}
                            style={{ width: '250px', padding: '0.5rem' }}
                        >
                            <option value={0}>Seleccionar Menú</option>
                            {/* Menu options would be mapped here */}
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
                <div className="row">
                    <div className="col">
                        <p className="mx-3 mt-2">
                            <b>Opciones de menú de Rol</b>
                        </p>
                    </div>
                    <div className="col">
                        <button onClick={() => {}}>Guardar</button>
                    </div>
                </div>
                <div className="mt-2" style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <p>TreeView de Opciones de Menú eliminado.</p>
                </div>
            </div>
        </div>
    )
}
