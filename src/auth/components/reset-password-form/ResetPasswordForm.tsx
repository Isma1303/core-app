import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resetPassword } from '../../services'
import './ResetPasswordForm.scss'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
        [navigate, email],
    )

    return (
        <form className={'reset-password-form space-y-4'} onSubmit={onSubmit}>
            <Input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10" required />
            <Button type="submit" disabled={loading} className="h-10 w-full">
                {loading ? 'Cargando...' : 'Recuperar mi contraseña'}
            </Button>
            <div className={'login-link'}>
                Volver a <Link to={'/login'}>Iniciar Sesión</Link>
            </div>
        </form>
    )
}
