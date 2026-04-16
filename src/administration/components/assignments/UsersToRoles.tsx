import { RoleService, UsersService, UsersToRolesService } from '../../services'
import { useState } from 'react'
import { User } from '../../interfaces'

const usersService = new UsersService()
const rolesService = new RoleService()
const usersToRolesService = new UsersToRolesService()

export const UsersToRoles = () => {
    const [userId, setUserId] = useState<number>(0)
    const [roleId, setRoleId] = useState<number>(0)

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserId(Number(e.target.value))
    }

    return (
        <div className="row mx-0 mx-md-3 mt-4">
            <div className="row mx-4">
                <div className="col-md-6 px-0">
                    <div className="row">
                        <h6>Lista de Usuarios</h6>
                    </div>
                    <div className="row">
                        <select 
                            value={userId} 
                            onChange={handleUserChange}
                            style={{ width: '250px', padding: '0.5rem' }}
                        >
                            <option value={0}>Seleccionar Usuario</option>
                            {/* In a real app, users would be mapped here */}
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
                    <b>Usuarios del Rol</b>
                </p>
                <div className="mt-2" style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <p>Grid de Usuarios del Rol eliminado.</p>
                </div>
            </div>
        </div>
    )
}
