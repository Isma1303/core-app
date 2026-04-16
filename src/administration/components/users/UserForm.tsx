import { User } from '../../interfaces'
import { useState } from 'react'

interface Props {
    user: User
}

interface EventsProps {
    rowUpdated: (rowAffected: boolean) => void
    closePopup: (close: boolean) => void
}

export const UserForm = (props: Props & EventsProps): JSX.Element => {
    const [formData, setFormData] = useState<User>(props.user)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here we would call the service to update/create
        props.rowUpdated(true)
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label>Usuario</label>
                <input 
                    type="text" 
                    value={formData.user || ''} 
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })} 
                    style={{ width: '100%', padding: '0.5rem' }} 
                    required 
                />
            </div>
            <div>
                <label>Nombre</label>
                <input 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    style={{ width: '100%', padding: '0.5rem' }} 
                    required 
                />
            </div>
            <div>
                <label>Correo Electrónico</label>
                <input 
                    type="email" 
                    value={formData.email || ''} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    style={{ width: '100%', padding: '0.5rem' }} 
                    required 
                />
            </div>
            {!props.user.user_id && (
                <>
                    <div>
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                            style={{ width: '100%', padding: '0.5rem' }} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Confirmar Contraseña</label>
                        <input 
                            type="password" 
                            style={{ width: '100%', padding: '0.5rem' }} 
                            required 
                        />
                    </div>
                </>
            )}
            <div>
                <label>
                    <input 
                        type="checkbox" 
                        checked={formData.status !== false} 
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })} 
                    /> ¿Activo?
                </label>
            </div>
            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Guardar</button>
        </form>
    )
}
