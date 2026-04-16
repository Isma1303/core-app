import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resetPassword } from '../../services'
import './ResetPasswordForm.scss'

const notificationText = "We've sent a link to reset your password. Check your inbox."

export const ResetPasswordForm = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            setLoading(true)

            const result = await resetPassword(email)
            setLoading(false)

            if (result.isOk) {
                navigate('/login')
                alert(notificationText)
            } else {
                alert(result.message)
            }
        },
        [navigate, email]
    )

    return (
        <form className={'reset-password-form'} onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
                type="email" 
                placeholder="Correo Electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '0.5rem' }}
                required 
            />
            <button type="submit" disabled={loading} style={{ padding: '0.5rem' }}>
                {loading ? 'Cargando...' : 'Recuperar mi contraseña'}
            </button>
            <div className={'login-link'}>
                Volver a <Link to={'/login'}>Iniciar Sesión</Link>
            </div>
        </form>
    )
}
