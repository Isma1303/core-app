import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginForm.scss'
import { useAuthStore } from '../..'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { KeyRound, UserRound, LogIn, Eye, EyeOff } from 'lucide-react'

export const LoginForm = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
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
        <form className="flex flex-col gap-4 w-full" onSubmit={onSubmit}>
            <div className="space-y-4">
                <div>
                    <img src="/logo.png" alt="Logo" className="w-48 mx-auto mb-4" />
                </div>
                <div className="relative w-full">
                    <UserRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Usuario"
                        defaultValue={formData.current.user}
                        onChange={(e) => (formData.current.user = e.target.value)}
                        required
                        className="pl-10 h-11 text-foreground bg-background border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all"
                        disabled={loading}
                    />
                </div>
                <div className="relative w-full">
                    <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        defaultValue={formData.current.password}
                        onChange={(e) => (formData.current.password = e.target.value)}
                        required
                        className="pl-10 pr-10 h-11 text-foreground bg-background border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all"
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-semibold transition-transform active:scale-[0.98] mt-2 ">
                    {loading ? 'Cargando...' : (
                        <div className="flex items-center justify-center">
                            <LogIn className="mr-2 w-5 h-5" />
                            Ingresar
                        </div>
                    )}
                </Button>
                <div className="text-center mt-4">
                    <Link to={'/reset-password'} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Olvidé mi contraseña
                    </Link>
                </div>
            </div>
        </form>
    )
}
