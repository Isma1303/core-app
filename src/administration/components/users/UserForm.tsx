import { User } from '../../interfaces'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'
import { UsersService } from '../../services'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Props {
    user: User
}

interface EventsProps {
    rowUpdated: (rowAffected: boolean) => void
    closePopup: (close: boolean) => void
}

export const UserForm = (props: Props & EventsProps): JSX.Element => {
    const usersService = new UsersService()
    const [formData, setFormData] = useState<User>(props.user)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = (): boolean => {
        if (!formData.user?.trim()) {
            toast.error('El usuario es requerido')
            return false
        }
        if (!formData.name?.trim()) {
            toast.error('El nombre es requerido')
            return false
        }
        if (!formData.email?.trim()) {
            toast.error('El correo electrónico es requerido')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('El correo electrónico no es válido')
            return false
        }
        if (!props.user.user_id && !formData.password?.trim()) {
            toast.error('La contraseña es requerida')
            return false
        }
        if (!props.user.user_id && formData.password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden')
            return false
        }
        if (!props.user.user_id && formData.password!.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        try {
            if (props.user.user_id) {
                // Actualizar usuario existente
                await usersService.updateRecord(props.user.user_id, {
                    user: formData.user,
                    name: formData.name,
                    email: formData.email,
                    status: formData.status,
                })
                toast.success('Usuario actualizado con éxito')
            } else {
                // Crear nuevo usuario
                await usersService.createRecord(formData)
                toast.success('Usuario creado con éxito')
            }
            props.rowUpdated(true)
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar el usuario')
            console.error('Error saving user:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-tight text-foreground/80 ml-1">Usuario</label>
                    <Input
                        type="text"
                        value={formData.user || ''}
                        onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                        className="h-11 border-border/60 bg-background/50 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-foreground/10 transition-all"
                        placeholder="Nombre de usuario"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-tight text-foreground/80 ml-1">Nombre</label>
                    <Input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11 border-border/60 bg-background/50 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-foreground/10 transition-all"
                        placeholder="Nombre completo"
                        required
                    />
                </div>
                <div className="col-span-full space-y-2">
                    <label className="text-sm font-semibold tracking-tight text-foreground/80 ml-1">Correo Electrónico</label>
                    <Input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-11 border-border/60 bg-background/50 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-foreground/10 transition-all"
                        placeholder="correo@ejemplo.com"
                        required
                    />
                </div>
                {!props.user.user_id && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-tight text-foreground/80 ml-1">Contraseña</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="h-11 pr-10 border-border/60 bg-background/50 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-foreground/10 transition-all"
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
                    </>
                )}
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/30 p-4 flex items-center justify-between transition-colors hover:bg-muted/40">
                <div className="space-y-0.5">
                    <label className="text-sm font-semibold tracking-tight text-foreground/90">Estado de usuario</label>
                    <p className="text-[12px] text-muted-foreground">Define si el usuario podrá acceder al sistema</p>
                </div>
                <label className="inline-flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                        checked={formData.status !== false}
                        onCheckedChange={(checked) => setFormData({ ...formData, status: checked === true })}
                        className="w-5 h-5 border-border/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground transition-all"
                    />
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">Activo</span>
                </label>
            </div>
            <div className="grid grid-cols-2 gap-x-6 pt-6 mt-2 border-t border-border/30">
                <Button
                    type="button"
                    disabled={isLoading}
                    variant="outline"
                    onClick={() => props.closePopup(true)}
                    className="h-11 w-full border-border/60 hover:bg-muted/80 text-foreground/80 hover:text-foreground transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full bg-foreground text-background hover:bg-foreground/90 shadow-md transition-all active:scale-[0.98] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        'Guardar'
                    )}
                </Button>
            </div>
        </form>
    )
}
