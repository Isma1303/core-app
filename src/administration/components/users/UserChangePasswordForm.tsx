import { User } from '../../interfaces'
import { useState } from 'react'

interface Props {
    user: User
}

interface EventsProps {
    rowUpdated: (rowAffected: boolean) => void
    closePopup: (close: boolean) => void
}

export const UserChangePasswordForm = (props: Props & EventsProps): JSX.Element => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden')
            return
        }
        // Here we would call the service
        props.rowUpdated(true)
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label>Contraseña</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }} 
                    required 
                />
            </div>
            <div>
                <label>Confirmar Contraseña</label>
                <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }} 
                    required 
                />
            </div>
            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Guardar</button>
        </form>
    )
}
