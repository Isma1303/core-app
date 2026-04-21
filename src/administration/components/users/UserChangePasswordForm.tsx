import { User } from '../../interfaces'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

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
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }
        
        // Here we would call the service
        props.rowUpdated(true)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-tight text-foreground/80 ml-1">Nueva Contraseña</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 pr-10 border-border/60 bg-background/50 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-foreground/10 transition-all"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-tight text-foreground/80 ml-1">Confirmar Contraseña</label>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-11 pr-10 border-border/60 bg-background/50 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-foreground/10 transition-all"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 pt-6 mt-2 border-t border-border/30">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => props.closePopup(true)}
                    className="h-11 w-full border-border/60 hover:bg-muted/80 text-foreground/80 hover:text-foreground transition-all active:scale-[0.98]"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="h-11 w-full bg-foreground text-background hover:bg-foreground/90 shadow-md transition-all active:scale-[0.98] font-medium"
                >
                    Guardar
                </Button>
            </div>
        </form>
    )
}
