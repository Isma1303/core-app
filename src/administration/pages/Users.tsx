import { useEffect, useState } from 'react'
import { UsersService } from '../services'
import { User } from '../interfaces'
import { UserChangePasswordForm, UserForm } from '../components'

export const Users = () => {
    const [userData, setUserData] = useState<User | null>(null)
    const [showUserForm, setShowUserForm] = useState(false)
    const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false)

    const unmountForm = () => {
        setUserData(null)
        setShowUserForm(false)
        setShowPasswordChangeForm(false)
    }

    const onRowAffected = () => {
        unmountForm()
        // Here we would reload data
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h2 className="content-block">Usuarios</h2>
            
            <div className="dx-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <p>Módulo de Usuarios - Grid (DevExtreme) eliminado.</p>
                <button onClick={() => { setUserData({} as User); setShowUserForm(true); }}>Nuevo Usuario</button>
            </div>

            {/* Placeholder for Data Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Usuario</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Nombre</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                            Listo para migración a shadcn/ui DataTable
                        </td>
                    </tr>
                </tbody>
            </table>

            {showUserForm && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000 
                }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '80vw', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3>{userData?.user_id ? 'Actualizar usuario' : 'Crear usuario'}</h3>
                        <UserForm user={userData!} rowUpdated={onRowAffected} closePopup={unmountForm} />
                        <button onClick={unmountForm} style={{ marginTop: '1rem' }}>Cerrar</button>
                    </div>
                </div>
            )}

            {showPasswordChangeForm && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000 
                }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '80vw', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3>Actualizar contraseña</h3>
                        <UserChangePasswordForm user={userData!} rowUpdated={onRowAffected} closePopup={unmountForm} />
                        <button onClick={unmountForm} style={{ marginTop: '1rem' }}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    )
}
