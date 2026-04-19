import { User } from '../../interfaces'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Usuario</label>
                <Input
                    type="text"
                    value={formData.user || ''}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                    className="h-10"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Correo Electrónico</label>
                <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-10"
                    required
                />
            </div>
            {!props.user.user_id && (
                <>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contraseña</label>
                        <Input type="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="h-10" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirmar Contraseña</label>
                        <Input type="password" className="h-10" required />
                    </div>
                </>
            )}
            <div className="rounded-lg border border-border bg-muted/40 p-3">
                <label className="inline-flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={formData.status !== false}
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                        className="h-4 w-4"
                    />{' '}
                    ¿Activo?
                </label>
            </div>
            <Button type="submit" className="h-10">
                Guardar
            </Button>
        </form>
    )
}
