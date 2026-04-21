import { useState, useCallback } from 'react'
import { toast } from 'sonner'
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
                toast.info(notificationText)
            } else {
                toast.error(result.message)
            }
        },
        [navigate, email],
    )

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <Input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all" required />
            <Button type="submit" disabled={loading} className="h-10 w-full bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-all">
                {loading ? 'Cargando...' : 'Recuperar mi contraseña'}
            </Button>
            <div className="text-center text-sm mt-4">
                Volver a <Link to={'/login'} className="text-muted-foreground hover:text-foreground transition-colors font-medium">Iniciar Sesión</Link>
            </div>
        </form>
    )
}
