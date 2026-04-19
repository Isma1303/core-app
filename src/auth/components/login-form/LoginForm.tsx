import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginForm.scss'
import { useAuthStore } from '../..'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { KeyRound, UserRound } from 'lucide-react'

export const LoginForm = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const formData = useRef({ user: '', password: '' })

    const authenticate = useAuthStore((state) => state.authenticate)

    const onSubmit = async (e: any) => {
        e.preventDefault()
        const { user, password } = formData.current
        setLoading(true)

        const responseAuth = await authenticate(user, password)
        if (responseAuth) {
            navigate('/home')
        }

        setLoading(false)
    }

    return (
        <form className={'login-form space-y-4'} onSubmit={onSubmit}>
            <h2 className="text-2xl font-semibold tracking-tight">Bienvenido</h2>
            <div className="space-y-3">
                <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Usuario"
                        defaultValue={formData.current.user}
                        onChange={(e) => (formData.current.user = e.target.value)}
                        required
                        className="h-10 pl-9"
                        disabled={loading}
                    />
                </div>
                <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="password"
                        placeholder="Contraseña"
                        defaultValue={formData.current.password}
                        onChange={(e) => (formData.current.password = e.target.value)}
                        required
                        className="h-10 pl-9"
                        disabled={loading}
                    />
                </div>
                <Button type="submit" disabled={loading} className="h-10 w-full">
                    {loading ? 'Cargando...' : 'Ingresar'}
                </Button>
                <div className={'link'}>
                    <Link to={'/reset-password'}>Olvidé mi contraseña</Link>
                </div>
            </div>
        </form>
    )
}
